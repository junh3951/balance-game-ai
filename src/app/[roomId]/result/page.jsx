// src/app/[roomId]/result/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
	determineSelectedOption,
	getRoomData,
	onStageChange,
} from '@/data/api/statemanager'
import { getOrGenerateBalanceGameQuestion } from '@/data/api/getBalanceGameQuestion'
import { userNameState, roomDataState } from '@/recoil/atoms'
import Header from './_components/header'
import OptionButton from './_components/option_button'
import ActionButtons from './_components/action_buttons'
import ActionButtons2 from './_components/action_buttons2'

export default function ResultPage() {
	const router = useRouter()
	const { roomId } = useParams()
	const userName = useRecoilValue(userNameState)
	const [resultData, setResultData] = useState(null)
	const [questionData, setQuestionData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [roomData, setRoomData] = useRecoilState(roomDataState)

	// Fetch room data to determine if the current user is the host
	useEffect(() => {
		const fetchRoomData = async () => {
			const response = await getRoomData(roomId)
			if (response.status === 200) {
				setRoomData(response.roomData)
			}
		}
		fetchRoomData()
	}, [roomId, setRoomData])

	// Fetch result data and question data
	useEffect(() => {
		const fetchResultAndQuestionData = async () => {
			try {
				const resultResponse = await determineSelectedOption(roomId)
				if (resultResponse.status === 200) {
					setResultData(resultResponse.result)
				} else {
					setError('결과를 가져오는 데 실패했습니다.')
				}

				// Fetch the game question (isHost = false, to not regenerate)
				const questionResponse = await getOrGenerateBalanceGameQuestion(
					roomId,
					'',
					false,
				)
				if (questionResponse.status === 200) {
					setQuestionData(questionResponse.questionData)
				} else {
					setError('질문을 가져오는 데 실패했습니다.')
				}
			} catch (err) {
				setError('데이터를 가져오는 중 오류가 발생했습니다.')
			} finally {
				setLoading(false)
			}
		}

		fetchResultAndQuestionData()
	}, [roomId])

	// Handle stage change and move all participants to the new stage
	useEffect(() => {
		const handleStageChange = (newStage) => {
			if (newStage === 'category') {
				// 카테고리 페이지로 이동
				router.push(`/${roomId}/category`)
			}
		}

		onStageChange(roomId, handleStageChange) // Listen to stage changes
	}, [roomId, router])

	// Determine if the current user is the host
	const isHost = roomData?.hostName === userName

	// Option voters rendering function
	const renderVoters = (optionVoters = []) => {
		if (optionVoters.length === 0) return <p>아무도 없었습니다..</p>
		return <p>{optionVoters.join(', ')}</p>
	}

	// Final result rendering function
	const renderFinalResult = () => {
		if (resultData?.result === 'draw') {
			return (
				<Header
					text={questionData?.question}
					finalOption="이븐하게 익었네요..(무승부)"
				/>
			)
		}
		const winner =
			resultData?.result === 'option1'
				? questionData?.option1
				: questionData?.option2
		return <Header text={questionData?.question} finalOption={winner} />
	}

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			{/* 헤더는 항상 유지 */}
			<div className="w-48 mb-8">
				<h1 className="text-2xl font-bold mt-8 break-words text-center">
					밸런스 게임 결과
				</h1>
			</div>

			{/* 로딩 중일 때도 이전 페이지의 버튼을 유지 */}
			<div className="flex flex-col items-center gap-4">
				<div className="flex items-center">
					<OptionButton
						optionText={
							questionData ? (
								<>
									{questionData.option1}
									<br />
									(득표 수: {resultData?.option1Count || '0'})
								</>
							) : (
								<>
									A
									<br />
									(득표 수: {resultData?.option1Count || '0'})
								</>
							)
						}
						color="#2C2C2C"
						textColor="#FFFFFF"
						borderRadius="20px 0px 0px 20px"
						direction="left"
						onSelect={() => {}}
					/>
					<OptionButton
						optionText={
							questionData ? (
								<>
									{questionData.option2}
									<br />
									(득표 수: {resultData?.option2Count || '0'})
								</>
							) : (
								<>
									B
									<br />
									(득표 수: {resultData?.option2Count || '0'})
								</>
							)
						}
						color="#F1F1F1"
						textColor="#000000"
						borderRadius="0px 20px 20px 0px"
						direction="right"
						onSelect={() => {}}
					/>
				</div>

				<div className="mt-8">
					{loading ? (
						<p>결과를 불러오는 중입니다...</p>
					) : (
						renderFinalResult()
					)}
				</div>

				{/* 각 옵션을 선택한 사람들 표시 */}
				<div className="flex flex-col items-center gap-4">
					<div className="p-4 rounded shadow-md w-80">
						<h2 className="text-xl font-bold mb-2">A</h2>
						{renderVoters(resultData?.option1Voters)}
					</div>
					<div className="p-4 rounded shadow-md w-80">
						<h2 className="text-xl font-bold mb-2">B</h2>
						{renderVoters(resultData?.option2Voters)}
					</div>
				</div>
			</div>

			{/* 호스트에게만 ActionButtons 표시 */}
			{isHost && <ActionButtons roomId={roomId} />}
			{!isHost && <ActionButtons2 roomId={roomId} />}

			{/* 로딩이 끝나면 결과 표시, 그 전까지는 로딩 중 메시지 표시 */}

			<div className="mt-32"></div>
		</div>
	)
}

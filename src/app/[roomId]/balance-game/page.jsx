'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { getOrGenerateBalanceGameQuestion } from '@/data/api/getBalanceGameQuestion'
import {
	getRoomData,
	setSelectedOption,
	saveOptionClick,
	onStageChange,
	trackOptionSelection, // Import the real-time tracking function
} from '@/data/api/statemanager'
import Header from './_components/header'
import OptionButton from './_components/option_button'
import { onValue, ref } from 'firebase/database'
import { database } from '@/data/firebase'

export default function BalanceGamePage() {
	const router = useRouter()
	const { roomId } = useParams()
	const userName = useRecoilValue(userNameState)
	const [roomData, setRoomData] = useState(null)
	const [questionData, setQuestionData] = useState(null)
	const [error, setError] = useState(null)
	const [selectedOption, setSelectedOptionState] = useState(null)
	const [progress, setProgress] = useState({
		selectedCount: 0,
		totalParticipants: 0,
	}) // Add state for progress tracking

	// Fetch room data and determine if the user is the host
	useEffect(() => {
		const fetchRoomDataAndQuestion = async () => {
			try {
				const response = await getRoomData(roomId)
				if (response.status === 200) {
					const fetchedRoomData = response.roomData
					setRoomData(fetchedRoomData)

					const isHost = fetchedRoomData.hostName === userName

					// Get or generate the question
					const questionResponse =
						await getOrGenerateBalanceGameQuestion(
							roomId,
							fetchedRoomData.selectedCategory,
							isHost,
						)

					if (questionResponse.status === 200) {
						setQuestionData(questionResponse.questionData)
					} else if (questionResponse.status === 202) {
						// Not the host and question hasn't been generated yet
						// Set up a listener to wait for the question
						const questionRef = ref(
							database,
							`rooms/${roomId}/balanceGameQuestion`,
						)
						onValue(questionRef, (snapshot) => {
							if (snapshot.exists()) {
								setQuestionData(snapshot.val())
							}
						})
					} else {
						setError('질문을 가져오는 데 실패했습니다.')
					}
				} else {
					setError('방 정보를 가져오는 데 실패했습니다.')
				}
			} catch (err) {
				console.error('Error:', err)
				setError('데이터를 가져오는 중 오류가 발생했습니다.')
			}
		}

		fetchRoomDataAndQuestion()

		// Track option selection progress in real-time
		trackOptionSelection(roomId, setProgress)
	}, [roomId, userName])

	// Handle stage changes
	useEffect(() => {
		const handleStageChange = (stage) => {
			if (stage === 'result') {
				router.push(`/${roomId}/result`) // 게임 결과 페이지로 이동
			}
		}

		onStageChange(roomId, handleStageChange)
	}, [roomId, router])

	// Option select function
	const handleOptionSelect = async (selectedOption) => {
		setSelectedOptionState(selectedOption)
		await setSelectedOption(roomId, userName, selectedOption)
		await saveOptionClick(roomId, userName, selectedOption)
		console.log(`사용자가 선택한 옵션: ${selectedOption}`)
	}

	if (error) {
		return <div>오류: {error}</div>
	}

	// 기존 questionData가 있으면 유지, 없으면 처음 렌더링
	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			{questionData ? (
				<>
					<div className="w-48 mb-12">
						<Header text={questionData.question} />
					</div>
					<div className="flex">
						<OptionButton
							optionText={questionData.option1}
							color="#2C2C2C"
							textColor="#FFFFFF"
							borderRadius="20px 0px 0px 20px"
							direction="left"
							isSelected={selectedOption === 'option1'}
							onSelect={() => handleOptionSelect('option1')}
						/>
						<OptionButton
							optionText={questionData.option2}
							color="#F1F1F1"
							textColor="#000000"
							borderRadius="0px 20px 20px 0px"
							direction="right"
							isSelected={selectedOption === 'option2'}
							onSelect={() => handleOptionSelect('option2')}
						/>
					</div>

					{/* Real-time option selection progress */}
					<div className="mt-8">
						<p>
							{progress.selectedCount} /{' '}
							{progress.totalParticipants} 명이 선택했습니다.
						</p>
					</div>
				</>
			) : (
				// 로딩 중이지만 이전 데이터가 없을 경우만 표시
				<div>질문을 불러오는 중입니다...</div>
			)}
		</div>
	)
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import {
	getOrGenerateBalanceGameQuestion,
	regenerateBalanceGameQuestion,
} from '@/data/api/getBalanceGameQuestion'
import {
	getRoomData,
	setSelectedOption,
	saveOptionClick,
	onStageChange,
	trackOptionSelection,
	determineSelectedOption,
	setGameStage, // Import the real-time tracking function
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

	// Skip button click handler
	const handleSkip = async () => {
		await determineSelectedOption(roomId)
		await setGameStage(roomId, 'result')
	}

	// Regenerate question button handler
	const handleRegen = async () => {
		try {
			const isHost = roomData?.hostName === userName
			const regenResponse = await regenerateBalanceGameQuestion(
				roomId,
				roomData.selectedCategory,
				isHost,
			)
			if (regenResponse.status === 200) {
				setQuestionData(regenResponse.questionData)
				console.log(
					`New question generated: ${regenResponse.questionData}`,
				)
			} else {
				setError('질문 재생성에 실패했습니다.')
			}
		} catch (error) {
			console.error('Error regenerating question:', error)
			setError('질문 재생성 중 오류가 발생했습니다.')
		}
	}

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
					<div className="mt-8 flex justify-center items-center">
						<p className="flex items-center text-bold">
							{progress.selectedCount} /{' '}
							{progress.totalParticipants} 명이 선택했습니다
							{/* Host-only Skip and Regenerate buttons */}
							{roomData?.hostName === userName && (
								<>
									<button
										onClick={handleSkip}
										className="ml-4 mb-2 w-auto h-auto px-4 py-1 rounded-full select-none transition-all duration-150 border-b-[1px] bg-gradient-to-r from-[#4A4A4A] to-[#6A6A6A] cursor-pointer text-white [box-shadow:0_10px_0_0_#4A4A4A,0_15px_0_0_#6A6A6A] active:translate-y-2 active:[box-shadow:0_0px_0_0_#4A4A4A,0_0px_0_0_#6A6A6A] active:border-b-[0px] border-[#5A5A5A] hover:bg-gradient-to-r hover:from-[#3A3A3A] hover:to-[#5A5A5A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
									>
										<span className="flex flex-col justify-center items-center font-bold text-sm">
											►
										</span>
									</button>
									<button
										onClick={handleRegen}
										className="ml-4 mb-2 w-auto h-auto px-4 rounded-full select-none transition-all duration-150 border-b-[1px] bg-gradient-to-r from-[#B8860B] to-[#DAA520] cursor-pointer text-white [box-shadow:0_10px_0_0_#B8860B,0_15px_0_0_#DAA520] active:translate-y-2 active:[box-shadow:0_0px_0_0_#B8860B,0_0px_0_0_#DAA520] active:border-b-[0px] border-[#A67C00] hover:bg-gradient-to-r hover:from-[#DAA520] hover:to-[#B8860B] focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
									>
										<span className="flex flex-col justify-center items-center font-bold text-xl">
											⟳
										</span>
									</button>
								</>
							)}
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

// src/app/[roomId]/balance-game/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { generateBalanceGameQuestion } from '@/data/api/getBalanceGameQuestion'
import {
	getRoomData,
	setSelectedOption,
	saveOptionClick,
	onStageChange,
} from '@/data/api/statemanager'
import Header from './_components/header'
import OptionButton from './_components/option_button'

export default function BalanceGamePage() {
	const router = useRouter()
	const { roomId } = useParams()
	const userName = useRecoilValue(userNameState) // Removed array destructuring to make sure it's not conditional
	const [roomData, setRoomData] = useState(null)
	const [questionData, setQuestionData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Fetch room data and question
	useEffect(() => {
		const fetchRoomDataAndQuestion = async () => {
			try {
				const response = await getRoomData(roomId)
				if (response.status === 200) {
					const fetchedRoomData = response.roomData
					setRoomData(fetchedRoomData)

					if (fetchedRoomData.selectedCategory) {
						const level = fetchedRoomData.selectedCategory
						const questionResponse =
							await generateBalanceGameQuestion(roomId, level)

						if (questionResponse.status === 200) {
							const parsedQuestionData = JSON.parse(
								questionResponse.questionData,
							)
							setQuestionData(parsedQuestionData)
						} else {
							setError('질문을 가져오는 데 실패했습니다.')
						}
					} else {
						setError('선택된 카테고리가 없습니다.')
					}
				} else {
					setError('방 정보를 가져오는 데 실패했습니다.')
				}
			} catch (err) {
				setError('데이터를 가져오는 중 오류가 발생했습니다.')
			} finally {
				setLoading(false)
			}
		}

		fetchRoomDataAndQuestion()
	}, [roomId])

	// Handle stage changes
	useEffect(() => {
		const handleStageChange = (stage) => {
			if (stage === 'result') {
				router.push(`/${roomId}/result`) // 게임 결과 페이지로 이동
			}
		}

		onStageChange(roomId, handleStageChange)
	}, [roomId, router]) // Hooks called outside any condition or loop

	// Option select function
	const handleOptionSelect = async (selectedOption) => {
		await setSelectedOption(roomId, userName, selectedOption)
		await saveOptionClick(roomId, userName, selectedOption)
		console.log(`사용자가 선택한 옵션: ${selectedOption}`)
	}

	if (loading) {
		return <div>질문을 불러오는 중입니다...</div>
	}

	if (error) {
		return <div>오류: {error}</div>
	}

	if (!questionData) {
		return <div>질문이 없습니다.</div>
	}

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
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
					onSelect={() => handleOptionSelect('option1')}
				/>
				<OptionButton
					optionText={questionData.option2}
					color="#F1F1F1"
					textColor="#000000"
					borderRadius="0px 20px 20px 0px"
					direction="right"
					onSelect={() => handleOptionSelect('option2')}
				/>
			</div>
		</div>
	)
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation' // roomId 가져오기
import { useRecoilState } from 'recoil'
import { selectedCategoriesState, userNameState } from '@/recoil/atoms'
import CategoryButton from './_components/category_button'
import Header from './_components/header'
import TrafficLight from './_components/traffic_light'
import {
	setSelectedCategory,
	onStageChange,
	trackCategorySelection,
	determineSelectedCategory,
	setGameStage,
	getRoomData, // 추가된 함수
} from '@/data/api/statemanager'

export default function CategoryPage() {
	const [selectedCategories, setSelectedCategories] = useRecoilState(
		selectedCategoriesState,
	)
	const [userName] = useRecoilState(userNameState)
	const [progress, setProgress] = useState({
		selectedCount: 0,
		totalParticipants: 0,
	})
	const [roomData, setRoomData] = useState(null) // roomData 추가
	const router = useRouter()
	const { roomId } = useParams() // roomId 가져오기
	const categories = ['순한맛', '중간맛', '매운맛'] // 주제 자극도 설정

	// roomData 가져오기 및 호스트 정보 확인
	useEffect(() => {
		const fetchRoomData = async () => {
			try {
				const response = await getRoomData(roomId)
				if (response.status === 200) {
					setRoomData(response.roomData)
				}
			} catch (error) {
				console.error('Error fetching room data:', error)
			}
		}

		fetchRoomData()
	}, [roomId])

	useEffect(() => {
		// 선택된 카테고리 초기화
		setSelectedCategories([])

		// Track category selection progress in real-time
		trackCategorySelection(roomId, setProgress)
	}, [roomId])

	// 카테고리 선택 토글
	const toggleCategory = async (category) => {
		setSelectedCategories([category]) // 한 번에 하나의 카테고리만 선택 가능

		// Firebase에 유저별 선택된 카테고리 저장
		await setSelectedCategory(roomId, userName, category)
	}

	// 게임 단계로 이동
	useEffect(() => {
		const handleStageChange = (stage) => {
			if (stage === 'game') {
				router.push(`/${roomId}/balance-game`) // 게임 단계로 이동
			}
		}

		onStageChange(roomId, handleStageChange) // 게임 단계 감지
	}, [roomId, router])

	// Skip button click handler
	const handleSkip = async () => {
		await determineSelectedCategory(roomId)
		await setGameStage(roomId, 'game')
	}

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<Header />
			<h1 className="text-l mt-4">매운 맛일수록 쎈 질문이 나와요!</h1>
			<div className="mt-20" />
			<TrafficLight roomId={roomId} /> {/* roomId 전달 */}
			<div className="mt-10" />
			<div className="grid grid-cols-1 gap-8 mt-8">
				{categories.map((category) => (
					<CategoryButton
						key={category}
						category={category}
						roomId={roomId} // roomId 전달
						isSelected={selectedCategories.includes(category)}
						toggleCategory={toggleCategory}
					/>
				))}
			</div>
			{/* Real-time category selection progress */}
			<div className="mt-8 flex justify-center items-center">
				<p className="flex items-center text-bold">
					{progress.selectedCount} / {progress.totalParticipants} 명이
					선택했습니다
					{/* 호스트만 스킵 버튼을 볼 수 있게 함 */}
					{roomData?.hostName === userName && (
						<button
							onClick={handleSkip}
							className="ml-4 mb-2 w-auto h-auto px-4 py-1 rounded-full select-none transition-all duration-150 border-b-[1px] bg-gradient-to-r from-[#4A4A4A] to-[#6A6A6A] cursor-pointer text-white [box-shadow:0_10px_0_0_#4A4A4A,0_15px_0_0_#6A6A6A] active:translate-y-2 active:[box-shadow:0_0px_0_0_#4A4A4A,0_0px_0_0_#6A6A6A] active:border-b-[0px] border-[#5A5A5A] hover:bg-gradient-to-r hover:from-[#3A3A3A] hover:to-[#5A5A5A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						>
							<span className="flex flex-col justify-center items-center font-bold text-sm">
								►
							</span>
						</button>
					)}
				</p>
			</div>
			<div className="mt-20" />
		</div>
	)
}

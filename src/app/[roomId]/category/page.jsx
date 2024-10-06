// src/app/[roomId]/category/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation' // roomId 가져오기
import { useRecoilState } from 'recoil'
import { selectedCategoriesState, userNameState } from '@/recoil/atoms'
import CategoryButton from './_components/category_button'
import Header from './_components/header'
import TrafficLight from './_components/traffic_light'
import { setSelectedCategory, onStageChange } from '@/data/api/statemanager'

export default function CategoryPage() {
	const [selectedCategories, setSelectedCategories] = useRecoilState(
		selectedCategoriesState,
	)
	const [userName] = useRecoilState(userNameState)
	const router = useRouter()
	const { roomId } = useParams() // roomId 가져오기
	const categories = ['순한맛', '중간맛', '매운맛'] // 주제 자극도 설정

	useEffect(() => {
		// 선택된 카테고리 초기화
		setSelectedCategories([])
	}, [])

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

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<Header />
			<h1 className="text-l mt-4">매울수록 부모님과 함께할 수 없어요</h1>
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
			<div className="mt-20" />
		</div>
	)
}

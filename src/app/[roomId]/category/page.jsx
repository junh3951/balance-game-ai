'use client'

import { useEffect, useState } from 'react'
import { set, ref } from 'firebase/database'
import { database } from '@/data/firebase'
import { useRouter, useParams } from 'next/navigation' // roomId 가져오기
import { useRecoilState } from 'recoil'
import { selectedCategoriesState } from '@/recoil/atoms'
import CategoryButton from './_components/category_button'
import GenerateGameButton from './_components/generate_game_button'
import Header from './_components/header'

export default function CategoryPage() {
	const [selectedCategories, setSelectedCategories] = useRecoilState(
		selectedCategoriesState,
	)
	const router = useRouter()
	const { roomId } = useParams() // roomId 가져오기
	const categories = ['순한맛', '중간맛', '매운맛'] // 주제 자극도 설정
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// 선택된 카테고리 초기화
		setSelectedCategories([])
	}, [])

	// 선택된 주제 자극도 Firebase에 저장
	const saveCategoriesToFirebase = async () => {
		setLoading(true)
		try {
			// Firebase에 선택된 카테고리 저장
			await set(
				ref(database, `rooms/${roomId}/selectedCategories`),
				selectedCategories,
			)
			console.log('Selected categories saved:', selectedCategories)
		} catch (error) {
			console.error('Error saving categories to Firebase:', error)
		} finally {
			setLoading(false)
			router.push(`/${roomId}/balance-game`)
		}
	}

	const toggleCategory = (category) => {
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((item) => item !== category)
			} else if (prev.length < 1) {
				// 최대 1개 카테고리만 선택 가능
				return [...prev, category]
			} else {
				return prev
			}
		})
	}

	useEffect(() => {
		console.log('선택된 카테고리:', selectedCategories) // 상태 확인용
	}, [selectedCategories])

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<Header />
			<h1 className="text-l mt-4">매울수록 부모님과 함께할 수 없어요</h1>
			<div className="grid grid-cols-2 gap-4 mt-8">
				{categories.map((category) => (
					<CategoryButton
						key={category}
						category={category}
						isSelected={selectedCategories.includes(category)}
						toggleCategory={toggleCategory}
					/>
				))}
			</div>
			<GenerateGameButton
				isActive={selectedCategories.length === 1}
				onClick={saveCategoriesToFirebase}
			/>
			{loading && <p> </p>}
		</div>
	)
}

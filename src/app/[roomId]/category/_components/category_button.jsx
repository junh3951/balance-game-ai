// src/app/[roomId]/category/_components/category_button.jsx
'use client'

import { useState } from 'react'
import { saveCategoryClick } from '@/data/api/statemanager' // Firebase 함수 임포트

export default function CategoryButton({
	category,
	roomId,
	isSelected,
	toggleCategory,
}) {
	// 카테고리에 따른 색상 정의
	const categoryColors = {
		순한맛: 'bg-green-500 text-white [box-shadow:0_10px_0_0_#22c55e,0_15px_0_0_#16a34a]',
		중간맛: 'bg-yellow-500 text-white [box-shadow:0_10px_0_0_#f59e0b,0_15px_0_0_#d97706]',
		매운맛: 'bg-red-500 text-white [box-shadow:0_10px_0_0_#ef4444,0_15px_0_0_#b91c1c]',
	}

	const handleClick = async () => {
		await saveCategoryClick(roomId, category) // Firebase에 클릭 기록 저장
		toggleCategory(category)
	}

	return (
		<button
			onClick={handleClick}
			className={`button w-80 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] ${
				isSelected
					? categoryColors[category] // 선택된 카테고리의 색상
					: 'bg-gradient-to-r from-[#4A4A4A] to-[#6A6A6A] cursor-pointer text-white [box-shadow:0_10px_0_0_#4A4A4A,0_15px_0_0_#6A6A6A]'
			} active:[box-shadow:0_0px_0_0_rgba(0,0,0,0)] active:translate-y-2 active:border-b-[0px]`}
			role="button"
		>
			<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
				{category}
			</span>
		</button>
	)
}

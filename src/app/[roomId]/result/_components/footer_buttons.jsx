// app/[roomId]/result/_components/FooterButtons.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useResetRecoilState } from 'recoil'
import {
	userSelectionState,
	balanceGameQuestionState,
	selectedCategoriesState,
	selectionCountsState,
} from '@/recoil/atoms'

export default function FooterButtons() {
	const router = useRouter()

	// Recoil 상태를 초기화하는 함수들
	// const resetUserSelection = useResetRecoilState(userSelectionState)
	const resetBalanceGameQuestion = useResetRecoilState(
		balanceGameQuestionState,
	)
	const resetSelectedCategories = useResetRecoilState(selectedCategoriesState)
	const resetSelectionCounts = useResetRecoilState(selectionCountsState)

	const handleResetState = () => {
		// resetUserSelection()
		resetBalanceGameQuestion()
		resetSelectedCategories()
		resetSelectionCounts()
	}

	const handleGoToMain = () => {
		handleResetState()
		router.push('/')
	}

	const handleShareAndDiscuss = () => {
		handleResetState()
		router.push('/community')
	}

	return (
		<div className="fixed bottom-4 w-full flex justify-center space-x-4 px-4">
			<button
				onClick={handleGoToMain}
				className="p-4 bg-blue-500 text-white rounded w-full max-w-md"
			>
				메인으로
			</button>
			<button
				onClick={handleShareAndDiscuss}
				className="p-4 bg-green-500 text-white rounded w-full max-w-md"
			>
				주제 공유하고 토론하기
			</button>
		</div>
	)
}

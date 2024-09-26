// app/[roomId]/result/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
	userSelectionState,
	balanceGameQuestionState,
	selectionCountsState,
} from '@/recoil/atoms'

import ResultTitle from './_components/result_title'
import UserSelection from './_components/user_selection'
import Statistics from './_components/statistics'
import FooterButtons from './_components/footer_buttons'

export default function ResultPage() {
	const { roomId } = useParams()
	const router = useRouter()

	const userSelection = useRecoilValue(userSelectionState)
	const balanceGameQuestion = useRecoilValue(balanceGameQuestionState)
	const setSelectionCounts = useSetRecoilState(selectionCountsState)

	useEffect(() => {
		if (!userSelection) {
			// 선택된 옵션이 없으면 이전 화면으로 이동
			router.push(`/${roomId}/balance-game`)
		} else {
			// 선택 수 업데이트 (실제로는 서버에 요청해야 함)
			setSelectionCounts((prev) => ({
				...prev,
				[userSelection]: prev[userSelection] + 1,
			}))
		}
	}, [userSelection, router, roomId, setSelectionCounts])

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<ResultTitle />
			<UserSelection
				selection={userSelection}
				balanceGameQuestion={balanceGameQuestion}
			/>
			<Statistics />
			<FooterButtons />
		</div>
	)
}

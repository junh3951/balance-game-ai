// app/[roomId]/result/_components/statistics.jsx
'use client'

import { useRecoilValue } from 'recoil'
import { selectionCountsState, balanceGameQuestionState } from '@/recoil/atoms'

export default function Statistics() {
	const selectionCounts = useRecoilValue(selectionCountsState)
	const balanceGameQuestion = useRecoilValue(balanceGameQuestionState)

	const totalSelections = selectionCounts.option1 + selectionCounts.option2

	const option1Percentage =
		totalSelections === 0
			? 0
			: ((selectionCounts.option1 / totalSelections) * 100).toFixed(1)

	const option2Percentage =
		totalSelections === 0
			? 0
			: ((selectionCounts.option2 / totalSelections) * 100).toFixed(1)

	return (
		<div className="mt-8 w-full max-w-md">
			<h2 className="text-xl font-semibold mb-4">다른 사람들의 선택</h2>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center">
					<div className="w-1/2 font-bold">
						{balanceGameQuestion.option1}
					</div>
					<div className="w-1/2 text-right">
						{option1Percentage}% ({selectionCounts.option1}명)
					</div>
				</div>
				<div className="flex items-center">
					<div className="w-1/2 font-bold">
						{balanceGameQuestion.option2}
					</div>
					<div className="w-1/2 text-right">
						{option2Percentage}% ({selectionCounts.option2}명)
					</div>
				</div>
			</div>
		</div>
	)
}

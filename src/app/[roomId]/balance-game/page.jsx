// app/[roomId]/balance-game/page.jsx
'use client'

import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useParams } from 'next/navigation'
import {
	selectedCategoriesState,
	balanceGameQuestionState,
} from '@/recoil/atoms'
import { getBalanceGameQuestion } from '@/data/api/getBalanceGameQuestion'
import Question from './_components/question'
import OptionButton from './_components/option_button'
import VSIndicator from './_components/vs_indecator'

export default function BalanceGamePage() {
	const { roomId } = useParams()
	const selectedCategories = useRecoilValue(selectedCategoriesState)
	const [balanceGameQuestion, setBalanceGameQuestion] = useRecoilState(
		balanceGameQuestionState,
	)

	useEffect(() => {
		async function fetchQuestion() {
			const questionData = await getBalanceGameQuestion(
				selectedCategories,
			)
			setBalanceGameQuestion(questionData)
		}

		fetchQuestion()
	}, [selectedCategories, setBalanceGameQuestion])

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<Question text={balanceGameQuestion.question} />
			<div className="flex items-center mt-8">
				<OptionButton
					option="option1"
					text={balanceGameQuestion.option1}
					example={balanceGameQuestion.example1}
				/>
				<VSIndicator />
				<OptionButton
					option="option2"
					text={balanceGameQuestion.option2}
					example={balanceGameQuestion.example2}
				/>
			</div>
		</div>
	)
}

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
import CategorySelection from './_components/CategorySelection'

export default function BalanceGamePage() {
  const { roomId } = useParams()
  const selectedCategories = useRecoilValue(selectedCategoriesState) // 선택된 카테고리 가져오기
  const [balanceGameQuestion, setBalanceGameQuestion] = useRecoilState(balanceGameQuestionState) // 밸런스 게임 질문 상태

  useEffect(() => {
    async function fetchQuestion() {
      if (selectedCategories.length === 2) { // 두 가지 카테고리가 선택된 경우만 실행
        const questionData = await getBalanceGameQuestion(selectedCategories)
        setBalanceGameQuestion(questionData)
      }
    }

    fetchQuestion()
  }, [selectedCategories, setBalanceGameQuestion])

  // 카테고리가 선택되지 않았을 때 CategorySelection을 렌더링
  if (selectedCategories.length !== 2) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">카테고리 선택</h1>
        <CategorySelection /> {/* 카테고리 선택 화면을 렌더링 */}
      </div>
    )
  }

  // 선택된 카테고리가 두 가지일 때만 질문과 선택지 렌더링
  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <Question text={balanceGameQuestion?.question || '질문을 불러오는 중...'} />
      <div className="flex items-center mt-8">
        <OptionButton
          option="option1"
          text={balanceGameQuestion?.option1 || ''}
          example={balanceGameQuestion?.example1 || ''}
        />
        <VSIndicator />
        <OptionButton
          option="option2"
          text={balanceGameQuestion?.option2 || ''}
          example={balanceGameQuestion?.example2 || ''}
        />
      </div>
    </div>
  )
}

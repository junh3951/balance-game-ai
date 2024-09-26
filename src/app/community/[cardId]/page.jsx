// app/community/[cardId]/page.jsx
'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCommunityCards } from '@/data/api/getCommunityCards'

export default function CardDetailPage() {
	const { cardId } = useParams()
	const [card, setCard] = useState(null)
	const router = useRouter()

	useEffect(() => {
		async function fetchCard() {
			const cards = await getCommunityCards()
			const selectedCard = cards.find((c) => c.id === cardId)

			if (selectedCard) {
				setCard(selectedCard)
			} else {
				// 카드가 없으면 커뮤니티 페이지로 이동
				router.push('/community')
			}
		}

		fetchCard()
	}, [cardId, router])

	if (!card) {
		return <div>로딩 중...</div>
	}

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<div className="bg-white shadow-md rounded p-4 mb-4 w-full max-w-2xl">
				<h1 className="text-2xl font-bold mb-4">{card.title}</h1>
				<p className="text-gray-700 mb-4">{card.content}</p>
				<div className="flex justify-between text-sm text-gray-500">
					<span>작성자: {card.author}</span>
					<span>{card.createdAt}</span>
				</div>
			</div>
			<div className="fixed bottom-4 w-full flex justify-center space-x-4 px-4">
				<button
					onClick={router.back}
					className="p-4 bg-blue-500 text-white rounded w-full max-w-md"
				>
					돌아가기
				</button>
			</div>
		</div>
	)
}

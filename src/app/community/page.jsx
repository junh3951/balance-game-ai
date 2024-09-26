// app/community/page.jsx
'use client'

import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { communityCardsState } from '@/recoil/atoms'
import { getCommunityCards } from '@/data/api/getCommunityCards'
import CardList from './_components/card_list'
import FooterButtons from './_components/footer_buttons'

export default function CommunityPage() {
	const [cards, setCards] = useRecoilState(communityCardsState)

	useEffect(() => {
		async function fetchCards() {
			const data = await getCommunityCards()
			setCards(data)
		}

		fetchCards()
	}, [setCards])

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<h1 className="text-2xl font-bold mt-4">커뮤니티</h1>
			<CardList cards={cards} />
			<FooterButtons />
		</div>
	)
}

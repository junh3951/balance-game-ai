// app/community/_components/card_list.jsx
'use client'

import Card from './card'

export default function CardList({ cards }) {
	return (
		<div className="mt-8 w-full max-w-2xl">
			{cards.map((card) => (
				<Card key={card.id} card={card} />
			))}
		</div>
	)
}

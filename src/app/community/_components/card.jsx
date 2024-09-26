// app/community/_components/card.jsx
'use client'

import Link from 'next/link'

export default function Card({ card }) {
	return (
		<Link href={`/community/${card.id}`}>
			<div className="bg-white shadow-md rounded p-4 mb-4 cursor-pointer hover:bg-gray-100">
				<h2 className="text-xl font-semibold mb-2">{card.title}</h2>
				<p className="text-gray-700 mb-4">{card.content}</p>
				<div className="flex justify-between text-sm text-gray-500">
					<span>작성자: {card.author}</span>
					<span>{card.createdAt}</span>
				</div>
			</div>
		</Link>
	)
}

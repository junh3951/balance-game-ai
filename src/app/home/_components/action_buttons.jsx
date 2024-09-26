// app/home/_components/ActionButtons.jsx
import React from 'react'
import Link from 'next/link'

export default function ActionButtons({ isActive }) {
	return (
		<div className="flex mt-4 space-x-4">
			<Link href="/room">
				<button
					className={`p-2 w-32 bg-blue-500 text-white rounded ${
						!isActive && 'opacity-50 pointer-events-none'
					}`}
				>
					방만들기
				</button>
			</Link>
			<Link href="/community">
				<button
					className={`p-2 w-32 bg-green-500 text-white rounded ${
						!isActive && 'opacity-50 pointer-events-none'
					}`}
				>
					커뮤니티
				</button>
			</Link>
		</div>
	)
}

// app/[roomId]/category/_components/generate_game_button.jsx
'use client'

import { useRouter, useParams } from 'next/navigation'

export default function GenerateGameButton({ isActive }) {
	const router = useRouter()
	const { roomId } = useParams() // useParams로 roomId 가져오기

	const handleGenerateGame = () => {
		if (isActive) {
			router.push(`/${roomId}/balance-game`)
		}
	}

	return (
		<div className="fixed bottom-4 w-full flex justify-center">
			<button
				onClick={handleGenerateGame}
				disabled={!isActive}
				className={`p-4 bg-green-500 text-white rounded w-full max-w-md ${
					!isActive ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				벨런스 게임 생성
			</button>
		</div>
	)
}

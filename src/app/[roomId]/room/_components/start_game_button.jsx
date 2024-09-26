// app/[roomId]/room/_components/start_game_button.jsx
'use client'

import { useRouter, useParams } from 'next/navigation'

export default function StartGameButton() {
	const router = useRouter()
	const { roomId } = useParams() // useParams로 roomId 가져오기

	const handleStartGame = () => {
		router.push(`/${roomId}/category`)
	}

	return (
		<div className="fixed bottom-4 w-full flex justify-center">
			<button
				onClick={handleStartGame}
				className="p-4 bg-green-500 text-white rounded w-full max-w-md"
			>
				게임 시작
			</button>
		</div>
	)
}

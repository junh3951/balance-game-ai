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
		<div className="fixed bottom-0 pb-8 w-full flex justify-center">
			<button
				onClick={StartGameButton}
				className={`button w-3/4 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] bg-gradient-to-r from-[#C0C0C0] to-[#E0E0E0] cursor-pointer text-[#4A4A4A] [box-shadow:0_10px_0_0_#C0C0C0,0_15px_0_0_#E0E0E0] active:translate-y-2 active:[box-shadow:0_0px_0_0_#C0C0C0,0_0px_0_0_#E0E0E0] active:border-b-[0px] border-[#D0D0D0]`}
				role="button"
			>
				<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
					게임 시작
				</span>
			</button>
		</div>
	)
}

'use client'

import { useRouter, useParams } from 'next/navigation'
import { setGameStage } from '@/data/api/statemanager' // 게임 단계 설정 함수 가져오기

export default function StartGameButton() {
	const router = useRouter()
	const { roomId } = useParams() // useParams로 roomId 가져오기

	const handleStartGame = async () => {
		// 게임 단계를 "category"로 설정하여 게임 시작
		await setGameStage(roomId, 'category')
	}

	return (
		<div className="fixed bottom-0 pb-12 w-full flex justify-center">
			<button
				onClick={handleStartGame}
				className={`button w-3/4 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] bg-gradient-to-r from-[#FFD700] to-[#FFC300] cursor-pointer text-[#4A4A4A] [box-shadow:0_10px_0_0_#FFFACD,0_15px_0_0_#FFE066] active:translate-y-2 active:[box-shadow:0_0px_0_0_#FFFACD,0_0px_0_0_#FFE066] active:border-b-[0px] border-[#FFFACD]`}
				role="button"
			>
				<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
					게임 시작
				</span>
			</button>
		</div>
	)
}

// app/home/_components/action_buttons.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { createRoom } from '@/data/api/makeroom'

export default function ActionButtons({ isActive }) {
	const router = useRouter()
	const userName = useRecoilValue(userNameState)

	const handleCreateRoom = async () => {
		const response = await createRoom(userName)
		if (response.status === 200) {
			const { roomData } = response
			router.push(`/${roomData.roomId}/room`)
		} else {
			alert('방 생성에 실패했습니다.')
		}
	}

	const handleGotoCommunity = () => {
		router.push('/community')
	}

	return (
		<div className="flex mt-4 space-x-4">
			<button
				onClick={handleCreateRoom}
				disabled={!isActive}
				className={`button w-40 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] ${
					isActive
						? 'bg-gradient-to-r from-sky-500 to-blue-600 cursor-pointer text-white [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841] active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841] active:border-b-[0px] border-blue-400'
						: 'bg-gray-400 cursor-not-allowed text-gray-200 border-gray-400'
				}`}
				role="button"
			>
				<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
					방만들기
				</span>
			</button>
			<button
				onClick={handleGotoCommunity}
				disabled={!isActive}
				className={`button w-40 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] ${
					isActive
						? 'bg-gradient-to-r from-sky-500 to-blue-600 cursor-pointer text-white [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841] active:translate-y-2 active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841] active:border-b-[0px] border-blue-400'
						: 'bg-gray-400 cursor-not-allowed text-gray-200 border-gray-400'
				}`}
				role="button"
			>
				<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
					커뮤니티
				</span>
			</button>
		</div>
	)
}

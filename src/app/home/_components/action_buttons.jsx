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
				className={`p-2 w-32 bg-blue-500 text-white rounded ${
					!isActive && 'opacity-50 pointer-events-none'
				}`}
			>
				방만들기
			</button>
			<button
				onClick={handleGotoCommunity}
				className={`p-2 w-32 bg-green-500 text-white rounded ${
					!isActive && 'opacity-50 pointer-events-none'
				}`}
			>
				커뮤니티
			</button>
		</div>
	)
}

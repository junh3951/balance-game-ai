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
		<div className="fixed bottom-0 pb-8 w-full flex justify-center">
			<div
				className={`flex mt-4 space-x-4 transition-transform duration-150 ${
					isActive ? 'translate-y-[-10px]' : 'translate-y-0'
				}`}
			>
				{/* 첫 번째 버튼 - #4A4A4A */}
				<button
					onClick={handleCreateRoom}
					disabled={!isActive}
					className={`button w-40 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] ${
						isActive
							? 'bg-gradient-to-r from-[#4A4A4A] to-[#6A6A6A] cursor-pointer text-white [box-shadow:0_10px_0_0_#4A4A4A,0_15px_0_0_#6A6A6A] active:translate-y-2 active:[box-shadow:0_0px_0_0_#4A4A4A,0_0px_0_0_#6A6A6A] active:border-b-[0px] border-[#5A5A5A]'
							: 'bg-gray-400 cursor-not-allowed text-gray-200 border-gray-400'
					}`}
					role="button"
				>
					<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
						방만들기
					</span>
				</button>

				{/* 두 번째 버튼 - 약간 더 어두운 색과 #4A4A4A 텍스트 */}
				<button
					onClick={handleGotoCommunity}
					disabled={!isActive}
					className={`button w-40 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] ${
						isActive
							? 'bg-gradient-to-r from-[#C0C0C0] to-[#E0E0E0] cursor-pointer text-[#4A4A4A] [box-shadow:0_10px_0_0_#C0C0C0,0_15px_0_0_#E0E0E0] active:translate-y-2 active:[box-shadow:0_0px_0_0_#C0C0C0,0_0px_0_0_#E0E0E0] active:border-b-[0px] border-[#D0D0D0]'
							: 'bg-gray-400 cursor-not-allowed text-gray-200 border-gray-400'
					}`}
					role="button"
				>
					<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
						커뮤니티
					</span>
				</button>
			</div>
		</div>
	)
}

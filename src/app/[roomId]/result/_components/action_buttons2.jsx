// app/result/_components/action_buttons.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { userNameState } from '@/recoil/atoms'

export default function ActionButtons2({ roomId }) {
	const router = useRouter()
	const userName = useRecoilValue(userNameState)

	// Handle "메인으로" button - Navigate to home
	const handleGoToHome = () => {
		router.push('/home')
	}

	return (
		<div className="fixed bottom-0 pb-8 w-full flex justify-center">
			<div className="flex mt-4 mb-2 space-x-4 transition-transform duration-150">
				{/* 첫 번째 버튼 - 메인으로 버튼 */}
				<button
					onClick={handleGoToHome}
					className="button w-80 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] bg-gradient-to-r from-[#4A4A4A] to-[#6A6A6A] cursor-pointer text-white [box-shadow:0_10px_0_0_#4A4A4A,0_15px_0_0_#6A6A6A] active:translate-y-2 active:[box-shadow:0_0px_0_0_#4A4A4A,0_0px_0_0_#6A6A6A] active:border-b-[0px] border-[#5A5A5A]"
					role="button"
				>
					<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
						메인으로
					</span>
				</button>
			</div>
		</div>
	)
}

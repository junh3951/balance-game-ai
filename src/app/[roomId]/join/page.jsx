'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { addParticipant } from '@/data/api/makeroom'

export default function JoinPage() {
	const router = useRouter()
	const { roomId } = useParams()
	const [userName, setUserName] = useRecoilState(userNameState)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const savedName = localStorage.getItem('userName') || '' // Load saved name from localStorage
		setUserName(savedName)
	}, [setUserName])

	// Function to handle room join
	const joinRoom = async () => {
		if (!userName.trim()) {
			alert('이름을 입력하세요.')
			return
		}

		setLoading(true)

		const response = await addParticipant(roomId, userName)

		if (response.status === 200) {
			router.push(`/${roomId}/room`) // Redirect to room
		} else {
			alert('방에 참가할 수 없습니다.')
		}

		setLoading(false)
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="flex flex-col items-center justify-center">
				{/* Overlapping Image Effect */}
				<div className="relative flex space-x-2 justify-center w-full pb-16">
					<div className="absolute left-5 z-10">
						<Image src="/흑.png" alt="흑" width={60} height={60} />
					</div>
					<div className="absolute left-16 z-10">
						<Image src="/백.png" alt="백" width={60} height={60} />
					</div>
				</div>
				<div className="mb-6">
					<Image
						src="/논리사.png"
						alt="논리사"
						width={160}
						height={80}
					/>
				</div>
			</div>

			{/* Name Input Section */}
			<div className="mb-8">
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					placeholder="이름을 입력하세요"
					className="border border-gray-300 rounded-md p-2 text-center w-full"
				/>
			</div>

			{/* Join Room Button */}
			<div className="mb-32">
				<button
					onClick={joinRoom}
					className={`${
						loading
							? 'bg-gray-400'
							: 'bg-blue-500 hover:bg-blue-600'
					} text-white px-4 py-2 rounded-md w-full`}
					disabled={loading}
				>
					{loading ? '참가 중...' : '참가하기'}
				</button>
			</div>
		</div>
	)
}

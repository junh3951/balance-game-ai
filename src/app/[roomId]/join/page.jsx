'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { addParticipant } from '@/data/api/makeroom'
import NameInput from './_components/name_input'
import EnterButton from './_components/enter_button'

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
				<NameInput name={userName} setName={setUserName} />
			</div>

			{/* Join Room Button */}
			<div className="w-full flex justify-center mb-32">
				<EnterButton
					isActive={userName.trim() !== '' && !loading}
					onEnter={joinRoom}
				/>
			</div>
		</div>
	)
}

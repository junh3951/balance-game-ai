// app/[roomId]/join/page.jsx
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { addParticipant } from '@/data/api/makeroom'

import NameInput from './_components/name_input'
import EnterButton from './_components/enter_button'

export default function JoinPage() {
	const [name, setName] = useRecoilState(userNameState)
	const [isActive, setIsActive] = useState(false)
	const router = useRouter()
	const { roomId } = useParams()

	const handleEnter = async () => {
		const response = await addParticipant(roomId, name)
		if (response.status === 200) {
			router.push(`/${roomId}/room`)
		} else {
			alert('방을 찾을 수 없습니다.')
			router.push('/')
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<NameInput
				name={name}
				setName={(value) => {
					setName(value)
					setIsActive(value.trim() !== '')
				}}
			/>
			<EnterButton isActive={isActive} onEnter={handleEnter} />
		</div>
	)
}

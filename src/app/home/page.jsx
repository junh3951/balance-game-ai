// app/home/page.jsx
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import NameInput from './_components/name_input'
import ActionButtons from './_components/action_buttons'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'

export default function HomePage() {
	const [name, setName] = useRecoilState(userNameState)

	useEffect(() => {
		const savedName = localStorage.getItem('userName') || '' // localStorage에서 저장된 이름을 불러오거나 빈 문자열로 초기화
		setName(savedName)
	}, [setName])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="flex flex-col items-center justify-center">
				{/* 이미지 오버랩 효과 */}
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

			<div className="mb-32">
				<NameInput name={name} setName={setName} />
			</div>

			<ActionButtons isActive={name.trim() !== ''} />
		</div>
	)
}

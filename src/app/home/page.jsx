// app/home/page.jsx
'use client'

import { useEffect } from 'react'
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
			<NameInput name={name} setName={setName} />
			<ActionButtons isActive={name.trim() !== ''} />
		</div>
	)
}

// app/home/page.jsx
'use client'

import NameInput from './_components/name_input'
import ActionButtons from './_components/action_buttons'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'

export default function HomePage() {
	const [name, setName] = useRecoilState(userNameState)

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<NameInput name={name} setName={setName} />
			<ActionButtons isActive={name.trim() !== ''} />
		</div>
	)
}

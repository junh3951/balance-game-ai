// app/[roomId]/balance-game/_components/option_button.jsx
'use client'

import { useRouter, useParams } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { userSelectionState } from '@/recoil/atoms'

export default function OptionButton({ option, text, example }) {
	const router = useRouter()
	const { roomId } = useParams()
	const [userSelection, setUserSelection] = useRecoilState(userSelectionState)

	const handleSelect = () => {
		setUserSelection(option)
		// 결과 화면으로 이동
		router.push(`/${roomId}/result`)
	}

	return (
		<div className="flex flex-col items-center mx-4">
			<button
				onClick={handleSelect}
				className="w-40 h-40 bg-blue-500 text-white rounded flex items-center justify-center text-xl"
			>
				{text}
			</button>
			<p className="mt-2 text-center">{example}</p>
		</div>
	)
}

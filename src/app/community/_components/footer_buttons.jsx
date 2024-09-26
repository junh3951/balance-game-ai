// app/[roomId]/result/_components/FooterButtons.jsx
'use client'

import { useRouter } from 'next/navigation'

export default function FooterButtons() {
	const router = useRouter()

	const handleGoToMain = () => {
		router.push('/')
	}

	return (
		<div className="fixed bottom-4 w-full flex justify-center space-x-4 px-4">
			<button
				onClick={handleGoToMain}
				className="p-4 bg-blue-500 text-white rounded w-full max-w-md"
			>
				메인으로
			</button>
		</div>
	)
}

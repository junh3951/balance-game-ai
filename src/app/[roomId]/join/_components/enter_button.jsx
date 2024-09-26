// app/[roomId]/join/_components/enter_button.jsx
'use client'

export default function EnterButton({ isActive, onEnter }) {
	return (
		<button
			onClick={onEnter}
			disabled={!isActive}
			className={`p-2 w-32 bg-blue-500 text-white rounded mt-4 ${
				!isActive ? 'opacity-50 cursor-not-allowed' : ''
			}`}
		>
			입장하기
		</button>
	)
}

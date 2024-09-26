// app/[roomId]/result/_components/user_selection.jsx
'use client'

export default function UserSelection({ selection, balanceGameQuestion }) {
	const selectedOption =
		selection === 'option1'
			? balanceGameQuestion.option1
			: balanceGameQuestion.option2

	return (
		<div className="mt-8">
			<p className="text-xl">당신의 선택은:</p>
			<p className="text-2xl font-bold mt-2">{selectedOption}</p>
		</div>
	)
}

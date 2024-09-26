// app/home/_components/NameInput.jsx
import React from 'react'

export default function NameInput({ name, setName }) {
	return (
		<input
			type="text"
			value={name}
			onChange={(e) => setName(e.target.value)}
			placeholder="이름을 입력하세요"
			className="border p-2 mt-4 w-full max-w-md rounded"
		/>
	)
}

// app/[roomId]/room/_components/header.jsx
'use client'

import { useEffect, useState } from 'react'

const Letter = ({ letter, className, animationDuration }) => {
	const [code, setCode] = useState(letter.toUpperCase().charCodeAt(0))

	useEffect(() => {
		let count = Math.floor(Math.random() * 10) + 10 // 애니메이션 시간 더 늘림
		const interval = setInterval(() => {
			setCode(() => Math.floor(Math.random() * 26) + 65)
			count--
			if (count === 0) {
				setCode(letter.toUpperCase().charCodeAt(0))
				clearInterval(interval)
			}
		}, animationDuration) // 애니메이션 간격 설정

		return () => clearInterval(interval)
	}, [letter, animationDuration])

	return <span className={className}>{String.fromCharCode(code)}</span>
}

const GibberishText = ({ text, className, animationDuration }) => {
	return (
		<>
			{text.split('').map((letter, index) => (
				<Letter
					className={className}
					letter={letter}
					key={`${index}-${letter}`}
					animationDuration={animationDuration} // 애니메이션 시간 전달
				/>
			))}
		</>
	)
}

export default function Header({ hostName }) {
	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mt-8 break-words text-center">
				{' '}
				<GibberishText
					text={`${hostName}의 대기실`}
					animationDuration={40}
				/>{' '}
				{/* 애니메이션 시간을 늘림 */}
			</h1>
		</div>
	)
}

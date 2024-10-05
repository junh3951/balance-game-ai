'use client'

import { useEffect, useState } from 'react'

// 색상 목록을 정의하여 랜덤하게 선택될 수 있도록 함
const colors = [
	'border-red-500 text-red-500',
	'border-green-500 text-green-500',
	'border-blue-500 text-blue-500',
	'border-yellow-500 text-yellow-500',
	'border-purple-500 text-purple-500',
	'border-pink-500 text-pink-500',
	'border-indigo-500 text-indigo-500',
	'border-teal-500 text-teal-500',
]

export default function ParticipantList({ participants, hostName }) {
	const [highlightedParticipants, setHighlightedParticipants] = useState([])

	// 3초 간격으로 랜덤하게 25%의 참가자에게 스타일을 적용
	useEffect(() => {
		const interval = setInterval(() => {
			const totalParticipants = participants.length
			const numberToHighlight = Math.ceil(totalParticipants * 0.25) // 25% 선택

			// 호스트는 선택 대상에서 제외
			const filteredParticipants = participants.filter(
				(participant) => participant !== hostName,
			)

			const shuffledParticipants = [...filteredParticipants].sort(
				() => 0.5 - Math.random(),
			)
			const selectedParticipants = shuffledParticipants.slice(
				0,
				numberToHighlight,
			)

			// 랜덤한 테두리와 글자 색상 적용
			const highlighted = selectedParticipants.map((participant) => ({
				name: participant,
				color: colors[Math.floor(Math.random() * colors.length)], // 랜덤 색상 선택
			}))

			setHighlightedParticipants(highlighted)
		}, 3000)

		return () => clearInterval(interval)
	}, [participants, hostName])

	return (
		<div className="w-full max-w-md">
			<h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
				참가자 명단
				{/* 참가자 수 표시 */}
				<span className="text-yellow-500 font-bold">
					{participants.length}
				</span>
				{/* 로딩 스피너 */}
				<span className="loader"></span>
			</h2>
			<div className="flex flex-wrap justify-center gap-2">
				{participants.map((participant, index) => {
					// 해당 참가자가 하이라이트 상태인지 확인하고, 스타일을 적용
					const highlighted = highlightedParticipants.find(
						(p) => p.name === participant,
					)

					return (
						<div
							key={index}
							className={`
                m-1 transform cursor-pointer rounded-full px-4 py-1 text-lg transition-transform duration-300 ease-in-out
                ${
					participant === hostName
						? 'bg-[#4a4a4a] text-yellow-500' // 호스트 스타일 유지
						: 'bg-white border-2 text-black'
				}
                ${
					highlighted
						? `bg-transparent ${highlighted.color} scale-110` // 랜덤 색상 테두리와 글자 색 적용
						: ''
				}
              `}
						>
							{participant}
							{participant === hostName && (
								<span className="ml-1">(호스트)</span>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

'use client'

import { useEffect, useState } from 'react'

// Define colors for random highlighting
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

	// Randomly highlight 25% of participants every 3 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			const totalParticipants = participants.length
			const numberToHighlight = Math.ceil(totalParticipants * 0.25) // 25% 선택

			// Exclude the host from selection
			const filteredParticipants = participants.filter(
				(participant) => participant !== hostName,
			)

			// Shuffle and pick participants to highlight
			const shuffledParticipants = [...filteredParticipants].sort(
				() => 0.5 - Math.random(),
			)
			const selectedParticipants = shuffledParticipants.slice(
				0,
				numberToHighlight,
			)

			// Apply random border and text color
			const highlighted = selectedParticipants.map((participant) => ({
				name: participant,
				color: colors[Math.floor(Math.random() * colors.length)], // Pick random color
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
					// Check if participant is highlighted
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
						? 'bg-[#4a4a4a] text-yellow-500' // Host style
						: 'bg-white border-2 text-black'
				}
                ${
					highlighted
						? `bg-transparent ${highlighted.color} scale-110`
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

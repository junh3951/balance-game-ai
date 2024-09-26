// app/[roomId]/room/_components/participant_list.jsx
'use client'

export default function ParticipantList({ participants }) {
	return (
		<div className="w-full max-w-md">
			<h2 className="text-xl font-semibold mb-2">참가자 명단</h2>
			<ul className="list-disc list-inside">
				{participants.map((participant, index) => (
					<li key={index}>{participant}</li>
				))}
			</ul>
		</div>
	)
}

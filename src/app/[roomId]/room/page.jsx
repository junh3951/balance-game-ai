// app/[roomId]/room/page.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userNameState, participantsState, roomDataState } from '@/recoil/atoms'
import { getRoomData, addParticipant } from '@/data/api/makeroom'

import Header from './_components/header'
import QRCodeGenerator from './_components/qr_code_generator'
import ParticipantList from './_components/participant_list'
import StartGameButton from './_components/start_game_button'

export default function RoomPage() {
	const router = useRouter()
	const { roomId } = useParams()
	const userName = useRecoilValue(userNameState)
	const [participants, setParticipants] = useRecoilState(participantsState)
	const [roomData, setRoomData] = useRecoilState(roomDataState)

	useEffect(() => {
		async function fetchRoomData() {
			const response = await getRoomData(roomId)
			if (response.status === 200) {
				setRoomData(response.roomData)
				setParticipants(response.roomData.participants)
			} else {
				alert('방을 찾을 수 없습니다.')
				router.push('/')
			}
		}

		fetchRoomData()

		// 실시간 업데이트를 위해 주기적으로 데이터를 가져옵니다.
		const interval = setInterval(fetchRoomData, 5000)

		return () => clearInterval(interval)
	}, [roomId, router, setParticipants, setRoomData])

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<Header hostName={roomData?.hostName || ''} />
			<QRCodeGenerator roomId={roomId} />
			<ParticipantList participants={participants} />
			<StartGameButton />
		</div>
	)
}

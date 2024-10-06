// src/app/[roomId]/room/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userNameState, participantsState, roomDataState } from '@/recoil/atoms'
import { onStageChange } from '@/data/api/statemanager'
import { onValue, ref } from 'firebase/database'
import { database } from '@/data/firebase'

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

	// Firebase에서 room 데이터와 참가자 목록을 실시간으로 가져오기
	useEffect(() => {
		const roomRef = ref(database, `rooms/${roomId}`)
		const unsubscribe = onValue(roomRef, (snapshot) => {
			const roomData = snapshot.val()
			if (roomData) {
				setRoomData(roomData)
				// 참가자 이름 배열 생성
				const participantNames = (roomData.participants || []).map(
					(participant) => participant.id,
				)
				setParticipants(participantNames)
			} else {
				alert('방을 찾을 수 없습니다.')
				router.push('/')
			}
		})

		// 컴포넌트 언마운트 시 Firebase 구독 해제
		return () => unsubscribe()
	}, [roomId, router, setParticipants, setRoomData])

	// 현재 사용자가 호스트인지 확인하는 변수
	const isHost = roomData?.hostName === userName

	// 게임 단계가 변경될 때 감지
	useEffect(() => {
		onStageChange(roomId, (currentStage) => {
			if (currentStage === 'category') {
				// 게임이 카테고리 단계로 이동하면 해당 페이지로 이동
				router.push(`/${roomId}/category`)
			}
		})
	}, [roomId, router])

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<Header hostName={roomData?.hostName || ''} />
			{/* QR 코드 생성 */}
			<QRCodeGenerator roomId={roomId} />
			<div className="mt-8" />
			{/* 호스트 이름을 함께 전달 */}
			<ParticipantList
				participants={participants}
				hostName={roomData?.hostName || ''}
			/>

			<div className="mb-32" />

			{/* 호스트만 StartGameButton을 볼 수 있도록 조건부 렌더링 */}
			{isHost && <StartGameButton />}
		</div>
	)
}

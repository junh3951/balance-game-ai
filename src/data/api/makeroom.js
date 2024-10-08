// src/data/api/makeroom.js

import { ref, set, get, update } from 'firebase/database'
import { database } from '@/data/firebase'
import { QRCodeSVG } from 'qrcode.react'

export async function createRoom(userName) {
	const roomId = `room-${Math.random().toString(36).substr(2, 9)}`
	const roomURL = `${window.location.origin}/${roomId}/join`
	const qrCode = <QRCodeSVG value={roomURL} size={200} />

	const roomData = {
		roomId,
		hostName: userName,
		participants: [
			{
				id: userName,
				selectedCategory: null, // 카테고리 초기화
			},
		],
		createdAt: new Date().toISOString(),
		qrCodeURL: roomURL,
		expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10시간 후 만료
	}

	// Firebase에 방 데이터 저장
	await set(ref(database, `rooms/${roomId}`), roomData)
	console.log('room created with data:', roomData)
	return { status: 200, roomData }
}

export async function addParticipant(roomId, userName) {
	try {
		const roomRef = ref(database, `rooms/${roomId}`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const roomData = snapshot.val()

			// 참가자 중복 확인
			const participantExists = roomData.participants.some(
				(participant) => participant.id === userName,
			)

			if (!participantExists) {
				// 새로운 참가자 객체 생성
				const newParticipant = {
					id: userName,
					selectedCategory: null,
				}

				roomData.participants.push(newParticipant)

				// Firebase에 참가자 업데이트
				await update(roomRef, {
					participants: roomData.participants,
				})
			}
			return { status: 200, roomData }
		} else {
			return { status: 404, error: 'Room not found' }
		}
	} catch (error) {
		console.error('Error adding participant:', error)
		return { status: 500, error: 'Failed to add participant' }
	}
}

export async function getRoomData(roomId) {
	try {
		// Firebase에서 방 데이터를 가져옴
		const roomRef = ref(database, `rooms/${roomId}`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const roomData = snapshot.val()
			console.log('room data:', roomData)
			return { status: 200, roomData }
		} else {
			console.log('Room not found in Firebase')
			return { status: 404, error: 'Room not found' }
		}
	} catch (error) {
		console.error('Error fetching room data from Firebase:', error)
		return { status: 500, error: 'Failed to fetch room data' }
	}
}

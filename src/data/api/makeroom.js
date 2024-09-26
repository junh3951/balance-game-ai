// src/data/api/makeroom.js

export async function createRoom(userName) {
	// 방 생성 로직을 가상으로 구현
	const roomId = 'room-' + Math.random().toString(36).substr(2, 9)
	const roomData = {
		roomId,
		hostName: userName,
		participants: [userName],
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000), // 10시간 후 만료
	}
	// 로컬 스토리지에 저장하여 데이터 유지
	localStorage.setItem(roomId, JSON.stringify(roomData))

	return { status: 200, roomData }
}

export async function getRoomData(roomId) {
	// 방 데이터 가져오기
	const roomData = JSON.parse(localStorage.getItem(roomId))
	if (roomData) {
		return { status: 200, roomData }
	} else {
		return { status: 404, error: 'Room not found' }
	}
}

export async function addParticipant(roomId, userName) {
	// 참가자 추가하기
	const roomData = JSON.parse(localStorage.getItem(roomId))
	if (roomData) {
		if (!roomData.participants.includes(userName)) {
			roomData.participants.push(userName)
			localStorage.setItem(roomId, JSON.stringify(roomData))
		}
		return { status: 200, roomData }
	} else {
		return { status: 404, error: 'Room not found' }
	}
}

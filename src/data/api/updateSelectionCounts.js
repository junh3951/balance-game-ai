// src/data/api/updateSelectionCounts.js

export async function updateSelectionCounts(roomId, selection) {
	// 실제로는 서버에 요청하여 통계 데이터를 업데이트해야 합니다.
	// 여기서는 localStorage를 사용하여 간단히 구현합니다.

	const key = `selectionCounts-${roomId}`
	const data = JSON.parse(localStorage.getItem(key)) || {
		option1: 0,
		option2: 0,
	}

	data[selection] += 1

	localStorage.setItem(key, JSON.stringify(data))

	return data
}

export async function getSelectionCounts(roomId) {
	const key = `selectionCounts-${roomId}`
	const data = JSON.parse(localStorage.getItem(key)) || {
		option1: 0,
		option2: 0,
	}

	return data
}

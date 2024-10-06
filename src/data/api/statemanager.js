// src/data/api/statemanager.js
import { ref, set, update, get, onValue } from 'firebase/database'
import { database } from '@/data/firebase'

// 유저별 카테고리 선택 저장
export async function setSelectedCategory(roomId, userName, selectedCategory) {
	try {
		const roomRef = ref(database, `rooms/${roomId}`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const roomData = snapshot.val()
			const participants = roomData.participants

			// 참가자 찾기
			const participantIndex = participants.findIndex(
				(participant) => participant.id === userName,
			)

			if (participantIndex !== -1) {
				// `selectedCategory` 업데이트
				participants[participantIndex].selectedCategory =
					selectedCategory

				// Firebase에 참가자 업데이트
				await update(roomRef, {
					participants: participants,
				})

				// 모든 참가자가 선택했는지 확인
				await checkAllParticipantsSelected(roomId)
			}
		}
	} catch (error) {
		console.error('Error setting selected category for participant:', error)
	}
}

async function checkAllParticipantsSelected(roomId) {
	try {
		const roomRef = ref(database, `rooms/${roomId}`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const roomData = snapshot.val()
			const participants = roomData.participants

			const allSelected = participants.every(
				(participant) => participant.selectedCategory !== null,
			)

			if (allSelected) {
				await setGameStage(roomId, 'game') // 게임 단계로 이동
				console.log(
					'All participants selected categories. Moving to game stage.',
				)
			}
		}
	} catch (error) {
		console.error('Error checking participants selected categories:', error)
	}
}

// 단계 설정 (room -> category -> game -> result)
export async function setGameStage(roomId, stage) {
	try {
		const roomRef = ref(database, `rooms/${roomId}`)
		await update(roomRef, {
			stage: stage,
		})
		console.log(`Game stage set to ${stage} for room ${roomId}`)
	} catch (error) {
		console.error('Error setting game stage:', error)
	}
}

// 단계 감지
export function onStageChange(roomId, callback) {
	const stageRef = ref(database, `rooms/${roomId}/stage`)
	onValue(stageRef, (snapshot) => {
		const currentStage = snapshot.val()
		if (currentStage) {
			callback(currentStage) // 현재 단계를 반환
		}
	})
}

// 카테고리 클릭 저장
export async function saveCategoryClick(roomId, category) {
	try {
		await update(ref(database, `rooms/${roomId}/lastClickedCategory`), {
			category: category,
			timestamp: Date.now(), // 항상 새로운 값으로 업데이트
		})
		console.log(`Category "${category}" clicked in room ${roomId}`)
	} catch (error) {
		console.error('Error saving category click:', error)
	}
}

// 카테고리 클릭 변경 감지
export function onCategoryClickChange(roomId, callback) {
	const categoryClickRef = ref(
		database,
		`rooms/${roomId}/lastClickedCategory`,
	)
	onValue(categoryClickRef, (snapshot) => {
		const data = snapshot.val()
		if (data) {
			callback(data.category) // 클릭된 카테고리를 콜백으로 전달
		}
	})
}

// 게임 옵션 선택 저장
export async function setSelectedOption(roomId, userName, option) {
	try {
		const roomRef = ref(
			database,
			`rooms/${roomId}/selectedOptions/${userName}`,
		)
		await set(roomRef, {
			option: option,
			selectedBy: userName,
		})
		console.log(
			`Option "${option}" selected by ${userName} in room ${roomId}`,
		)
	} catch (error) {
		console.error('Error setting selected option:', error)
	}
}

// 옵션 선택 감지
export function onOptionSelect(roomId, callback) {
	const optionsRef = ref(database, `rooms/${roomId}/selectedOptions`)
	onValue(optionsRef, (snapshot) => {
		const optionsData = snapshot.val()
		if (optionsData) {
			callback(optionsData)
		}
	})
}

// 카운트다운 설정
export async function setCountdown(roomId, countdownValue) {
	try {
		await update(ref(database, `rooms/${roomId}`), {
			countdown: countdownValue,
		})
		console.log(`Countdown set to ${countdownValue} for room ${roomId}`)
	} catch (error) {
		console.error('Error setting countdown:', error)
	}
}

// 카운트다운 감지
export function onCountdownChange(roomId, callback) {
	const countdownRef = ref(database, `rooms/${roomId}/countdown`)
	onValue(countdownRef, (snapshot) => {
		const countdownValue = snapshot.val()
		if (countdownValue !== null) {
			callback(countdownValue)
		}
	})
}

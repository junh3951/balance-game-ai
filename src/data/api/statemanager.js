// src/data/api/statemanager.js
import { ref, set, update, get, onValue } from 'firebase/database'
import { database } from '@/data/firebase'

// 단계 설정 (room -> category -> game -> result)
export async function setGameStage(roomId, stage) {
	try {
		await update(ref(database, `rooms/${roomId}`), {
			stage: stage, // 현재 단계를 저장
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

// 카테고리 선택 저장
export async function setSelectedCategory(roomId, selectedCategory) {
	try {
		await update(ref(database, `rooms/${roomId}`), {
			selectedCategory: selectedCategory,
		})
		console.log(
			`Category "${selectedCategory}" selected for room ${roomId}`,
		)
	} catch (error) {
		console.error('Error setting selected category:', error)
	}
}

// 카테고리 선택 감지
export function onCategoryChange(roomId, callback) {
	const categoryRef = ref(database, `rooms/${roomId}/selectedCategory`)
	onValue(categoryRef, (snapshot) => {
		const selectedCategory = snapshot.val()
		if (selectedCategory) {
			callback(selectedCategory)
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

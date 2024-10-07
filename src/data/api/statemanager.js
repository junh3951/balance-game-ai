// src/data/api/statemanager.js
import { ref, set, update, get, remove, onValue } from 'firebase/database'
import { database } from '@/data/firebase'

// roomData를 가져오는 함수 추가
export async function getRoomData(roomId) {
	try {
		const roomRef = ref(database, `rooms/${roomId}`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const roomData = snapshot.val()
			return { status: 200, roomData }
		} else {
			console.log(`Room ${roomId} does not exist`)
			return { status: 404, error: 'Room not found' }
		}
	} catch (error) {
		console.error('Error fetching room data:', error)
		return { status: 500, error: 'Failed to fetch room data' }
	}
}

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
		const roomRef = ref(database, `rooms/${roomId}/participants`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const participants = snapshot.val()

			// Iterate over each participant's ID and check if selectedCategory exists and is not null
			const allSelected = Object.keys(participants).every(
				(participantId) => {
					const selectedCategory =
						participants[participantId]?.selectedCategory
					return (
						selectedCategory !== null &&
						selectedCategory !== undefined
					)
				},
			)

			if (allSelected) {
				// Call other functions once all participants have selected a category
				await determineSelectedCategory(roomId)
				await setGameStage(roomId, 'game') // Move to the game stage
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

// 가장 많이 선택된 카테고리를 결정하는 함수
export async function determineSelectedCategory(roomId) {
	try {
		const roomRef = ref(database, `rooms/${roomId}`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const roomData = snapshot.val()
			const participants = roomData.participants || []

			// 카테고리 투표 수 집계
			const categoryCounts = {
				순한맛: 0,
				중간맛: 0,
				매운맛: 0,
			}

			participants.forEach((participant) => {
				const selectedCategory = participant.selectedCategory
				if (
					selectedCategory &&
					categoryCounts.hasOwnProperty(selectedCategory)
				) {
					categoryCounts[selectedCategory] += 1
				}
			})

			// 가장 많이 선택된 카테고리 결정
			const categories = ['매운맛', '중간맛', '순한맛'] // 우선순위
			let maxCount = 0
			let selectedCategory = '순한맛' // 기본값

			categories.forEach((category) => {
				const count = categoryCounts[category]
				if (count > maxCount) {
					maxCount = count
					selectedCategory = category
				} else if (count === maxCount && count > 0) {
					// 동률일 경우 우선순위에 따라 결정되므로 이미 정렬된 categories 배열 사용
					selectedCategory = category
				}
			})

			// roomData에 selectedCategory 업데이트
			await update(roomRef, {
				selectedCategory: selectedCategory,
			})

			console.log(
				`Room ${roomId} selected category is "${selectedCategory}"`,
			)

			return { status: 200, selectedCategory }
		} else {
			console.log(`Room ${roomId} does not exist`)
			return { status: 404, error: 'Room not found' }
		}
	} catch (error) {
		console.error('Error determining selected category:', error)
		return { status: 500, error: 'Failed to determine selected category' }
	}
}

// 게임 옵션 선택 저장 - 참가자의 선택을 `/participants/[userName]/selectedOption`에 저장
export async function setSelectedOption(roomId, userName, selectedOption) {
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
				participants[participantIndex].selectedOption = selectedOption

				// Firebase에 참가자 업데이트
				await update(roomRef, {
					participants: participants,
				})

				// 모든 참가자가 선택했는지 확인
				await checkAllParticipantsSelectedOption(roomId)
			}
		}
	} catch (error) {
		console.error('Error setting selected option for participant:', error)
	}
}

// 옵션 클릭을 `/lastClickedOption`에 저장 - 클릭한 옵션과 시간을 기록
export async function saveOptionClick(roomId, userName, selectedOption) {
	try {
		const optionRef = ref(database, `rooms/${roomId}/lastClickedOption`)
		await set(optionRef, {
			selectedOption: selectedOption,
			timestamp: Date.now(),
		})
		console.log(`Option "${selectedOption}" clicked by ${userName}`)
	} catch (error) {
		console.error('Error saving option click:', error)
	}
}

// 옵션 클릭 변경 감지 - `/lastClickedOption` 경로의 변화를 실시간으로 감지
export function onOptionClickChange(roomId, callback) {
	const optionsRef = ref(database, `rooms/${roomId}/lastClickedOption`)
	onValue(optionsRef, (snapshot) => {
		const optionsData = snapshot.val()
		if (optionsData) {
			callback(optionsData) // 선택된 옵션 데이터를 전달
		}
	})
}

export async function checkAllParticipantsSelectedOption(roomId) {
	try {
		const roomRef = ref(database, `rooms/${roomId}/participants`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const participants = snapshot.val()

			// Check if every participant has a valid 'selectedOption'
			const allSelected = Object.keys(participants).every(
				(participantId) => {
					const selectedOption =
						participants[participantId]?.selectedOption
					return (
						selectedOption !== null && selectedOption !== undefined
					)
				},
			)

			if (allSelected) {
				await determineSelectedOption(roomId) // 결과 결정
				await setGameStage(roomId, 'result') // 게임 단계로 이동
				console.log(
					'All participants have selected options. Moving to result stage.',
				)
			}
		}
	} catch (error) {
		console.error(
			'Error checking if all participants selected options:',
			error,
		)
	}
}

// 더 정교한 결과 집계를 위한 determineSelectedOption 함수
export async function determineSelectedOption(roomId) {
	try {
		// participants 데이터를 가져옴
		const roomRef = ref(database, `rooms/${roomId}/participants`)
		const snapshot = await get(roomRef)

		if (snapshot.exists()) {
			const participants = snapshot.val()
			let option1Count = 0
			let option2Count = 0
			const option1Voters = []
			const option2Voters = []

			// 선택된 옵션을 집계
			Object.entries(participants).forEach(([_, participant]) => {
				// 'id' 필드를 사용해 저장
				const voterId = participant.id
				if (participant.selectedOption === 'option1') {
					option1Count++
					option1Voters.push(voterId) // option1 선택자 추가
				} else if (participant.selectedOption === 'option2') {
					option2Count++
					option2Voters.push(voterId) // option2 선택자 추가
				}
			})

			// 결과 도출 (option1 vs option2)
			let result
			if (option1Count > option2Count) {
				result = 'option1'
			} else if (option2Count > option1Count) {
				result = 'option2'
			} else {
				result = 'draw' // 무승부 처리
			}

			// 최종 결과 데이터 객체 생성
			const finalResult = {
				option1Count: option1Count,
				option2Count: option2Count,
				option1Voters: option1Voters,
				option2Voters: option2Voters,
				result: result,
			}

			// Firebase의 Realtime Database에 finalResult 저장
			await update(
				ref(database, `rooms/${roomId}/finalResult`),
				finalResult,
			)

			console.log(`Final result for room ${roomId} is:`, finalResult)

			// JSON 객체 형태로 반환
			return {
				status: 200,
				result: finalResult,
			}
		} else {
			console.error('Room data not found')
			return { status: 404, error: 'Room not found' }
		}
	} catch (error) {
		console.error('Error determining selected option:', error)
		return { status: 500, error: 'Failed to determine selected option' }
	}
}

// Function to track how many participants selected a category in real-time
export async function trackCategorySelection(roomId, callback) {
	try {
		const roomRef = ref(database, `rooms/${roomId}/participants`)
		onValue(roomRef, (snapshot) => {
			if (snapshot.exists()) {
				const participants = snapshot.val()
				let totalParticipants = Object.keys(participants).length
				let selectedCount = 0

				// Count how many participants have selected a category
				Object.values(participants).forEach((participant) => {
					if (participant.selectedCategory) {
						selectedCount++
					}
				})

				// Provide data to the callback
				callback({ selectedCount, totalParticipants })
			}
		})
	} catch (error) {
		console.error('Error tracking category selection:', error)
	}
}

// Function to track how many participants selected an option in real-time
export async function trackOptionSelection(roomId, callback) {
	try {
		const roomRef = ref(database, `rooms/${roomId}/participants`)
		onValue(roomRef, (snapshot) => {
			if (snapshot.exists()) {
				const participants = snapshot.val()
				let totalParticipants = Object.keys(participants).length
				let selectedCount = 0

				// Count how many participants have selected an option
				Object.values(participants).forEach((participant) => {
					if (participant.selectedOption) {
						selectedCount++
					}
				})

				// Provide data to the callback
				callback({ selectedCount, totalParticipants })
			}
		})
	} catch (error) {
		console.error('Error tracking option selection:', error)
	}
}

// Function to reset the game for a new round
export async function resetGame(roomId) {
	try {
		// Clear the final result and balance game question
		await remove(ref(database, `rooms/${roomId}/finalResult`))
		await remove(ref(database, `rooms/${roomId}/balanceGameQuestion`))
		await remove(ref(database, `rooms/${roomId}/selectedCategory`))

		// Clear selectedCategory and selectedOption for each participant
		const participantsRef = ref(database, `rooms/${roomId}/participants`)
		const snapshot = await get(participantsRef)
		if (snapshot.exists()) {
			const participants = snapshot.val()
			for (const participantId in participants) {
				// Clear selectedCategory and selectedOption for each participant
				await update(
					ref(
						database,
						`rooms/${roomId}/participants/${participantId}`,
					),
					{
						selectedCategory: null,
						selectedOption: null,
					},
				)
			}
		}

		console.log(`Room ${roomId} has been reset for a new round.`)
		return { status: 200 }
	} catch (error) {
		console.error('Error resetting the game:', error)
		return { status: 500, error: 'Failed to reset the game.' }
	}
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

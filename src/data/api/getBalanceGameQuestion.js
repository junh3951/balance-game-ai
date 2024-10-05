// src/data/api/getBalanceGameQuestion.js
import { ref, set, get } from 'firebase/database'
import { database } from '@/data/firebase'

// 주제 자극도를 Firebase에 저장하는 함수
export async function saveSelectedCategory(roomId, selectedCategory) {
	try {
		// Firebase에 선택된 주제 자극도 저장
		await set(ref(database, `rooms/${roomId}/selectedCategory`), {
			category: selectedCategory,
			timestamp: new Date().toISOString(), // 저장 시각
		})
		console.log(
			`Selected category "${selectedCategory}" saved for room ${roomId}`,
		)
		return { status: 200 }
	} catch (error) {
		console.error('Error saving category to Firebase:', error)
		return { status: 500, error: 'Failed to save category' }
	}
}

// 선택된 주제 자극도를 Firebase에서 불러오는 함수
export async function getSelectedCategory(roomId) {
	try {
		const categoryRef = ref(database, `rooms/${roomId}/selectedCategory`)
		const snapshot = await get(categoryRef)

		if (snapshot.exists()) {
			const categoryData = snapshot.val()
			console.log('Selected category data:', categoryData)
			return { status: 200, categoryData }
		} else {
			console.log('No selected category found')
			return { status: 404, error: 'No selected category found' }
		}
	} catch (error) {
		console.error('Error fetching category from Firebase:', error)
		return { status: 500, error: 'Failed to fetch category' }
	}
}

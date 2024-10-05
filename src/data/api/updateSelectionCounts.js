// src/data/api/updateSelectionCounts.js

import { getFirestore } from 'firebase/firestore';
import { firestore } from './firebase'; // Firestore 초기화 설정이 들어있는 파일을 import


/**
 * 사용자의 선택에 따라 선택지 카운트를 업데이트하는 함수
 * @param {string} questionId - 업데이트할 질문 ID
 * @param {string} selectedOption - 사용자가 선택한 옵션 (option1 또는 option2)
 */
export const updateSelectionCounts = async (questionId, selectedOption) => {
	try {
	  // Firestore에서 질문 문서를 참조
	  const questionRef = doc(firestore, 'balanceGameQuestions', questionId);
  
	  // 문서가 존재하는지 확인
	  const questionSnapshot = await getDoc(questionRef);
  
	  if (questionSnapshot.exists()) {
		// 선택된 옵션에 따라 카운트 업데이트
		if (selectedOption === 'option1') {
		  await updateDoc(questionRef, {
			option1Count: increment(1) // option1의 카운트 1 증가
		  });
		} else if (selectedOption === 'option2') {
		  await updateDoc(questionRef, {
			option2Count: increment(1) // option2의 카운트 1 증가
		  });
		}
	  } else {
		// 질문 문서가 없을 경우 새로 생성 (옵션 카운트를 1로 시작)
		await setDoc(questionRef, {
		  option1Count: selectedOption === 'option1' ? 1 : 0,
		  option2Count: selectedOption === 'option2' ? 1 : 0
		});
	  }
	} catch (error) {
	  console.error('Error updating selection counts:', error);
	  throw new Error('Failed to update selection counts');
	}
  };

export async function getSelectionCounts(roomId) {
	const key = `selectionCounts-${roomId}`
	const data = JSON.parse(localStorage.getItem(key)) || {
		option1: 0,
		option2: 0,
	}

	return data
}

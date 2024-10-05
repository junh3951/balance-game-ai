// src/data/api/getCommunityCards.js

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/data/firebase'; // Firestore 초기화 설정이 들어있는 파일을 import


export const getCommunityCards = async () => {
	try {
	  const querySnapshot = await getDocs(collection(firestore, 'communityCards')); // Firestore의 'communityCards' 컬렉션에서 문서 가져오기
	  const communityCards = [];
	  querySnapshot.forEach((doc) => {
		communityCards.push({ id: doc.id, ...doc.data() });
	  });
	  return communityCards;
	} catch (error) {
	  console.error('Error getting community cards:', error);
	  throw new Error('Failed to get community cards');
	}
  };
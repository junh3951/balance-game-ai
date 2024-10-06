import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: 'balance-ai-fa833.firebaseapp.com',
	databaseURL: 'https://balance-ai-fa833-default-rtdb.firebaseio.com',
	projectId: 'balance-ai-fa833',
	storageBucket: 'balance-ai-fa833.appspot.com',
	messagingSenderId: '45387707024',
	appId: '1:45387707024:web:730a40cf6a776fa0b65e15',
	measurementId: 'G-K0KLDZW7G0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Database and Firestore
export const database = getDatabase(app)
export const firestore = getFirestore(app)

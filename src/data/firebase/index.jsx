import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBRG8rnCFsbLQGZkYbRm9m8KYd4tk3z7x4",
    authDomain: "balance-ai-fa833.firebaseapp.com",
    databaseURL: "https://balance-ai-fa833-default-rtdb.firebaseio.com",
    projectId: "balance-ai-fa833",
    storageBucket: "balance-ai-fa833.ㄱappspot.com",
    messagingSenderId: "45387707024",
    appId: "1:45387707024:web:730a40cf6a776fa0b65e15",
    measurementId: "G-K0KLDZW7G0"
  };

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

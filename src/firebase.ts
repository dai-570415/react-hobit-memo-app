import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCWL9zaPDg2Vfqqdo9BvjdpnUsguJ34UQY",
    authDomain: "habit-memo.firebaseapp.com",
    projectId: "habit-memo",
    storageBucket: "habit-memo.firebasestorage.app",
    messagingSenderId: "261752993236",
    appId: "1:261752993236:web:faee60b124cc2c58aed241"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

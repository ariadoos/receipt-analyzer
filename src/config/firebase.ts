import { initializeApp } from 'firebase/app';
import {
    collection,
    getDocs,
    getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const Firestore = {
    getParticipants: async () => {
        // 1. Reference the collection
        const colRef = collection(db, "test");

        // 2. Use getDocs (plural) to fetch the entire collection
        const querySnapshot = await getDocs(colRef);

        // 3. Map through the documents to get the data
        const participants = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return participants;
    },
};
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxeADNlJiXm_4qVk_DovTwKkezNpsAeyE",
  authDomain: "prep-verse.firebaseapp.com",
  projectId: "prep-verse",
  storageBucket: "prep-verse.firebasestorage.app",
  messagingSenderId: "130500747551",
  appId: "1:130500747551:web:95f89cc073040b144dd02a",
  measurementId: "G-55Q05XD6Y8"
};

const appp=!getApps().length?initializeApp(firebaseConfig):getApps()[0];
export const db=getFirestore(appp);
export const auth=getAuth(appp);            
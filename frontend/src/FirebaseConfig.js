import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBJs6AH9K1UtaxyB28D5xyeSgggv-pswU",
  authDomain: "authen-35fdc.firebaseapp.com",
  projectId: "authen-35fdc",
  storageBucket: "authen-35fdc.firebasestorage.app",
  messagingSenderId: "240115431709",
  appId: "1:240115431709:web:f6ff481367871d5d2ec9f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);

import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC37j4VUCZV408D3gDlZAQoPxLNx6kZjfQ",
  authDomain: "chatapp-clone-8026f.firebaseapp.com",
  projectId: "chatapp-clone-8026f",
  storageBucket: "chatapp-clone-8026f.appspot.com",
  messagingSenderId: "830853832490",
  appId: "1:830853832490:web:a28d1bd6c93179377ec853",
  measurementId: "G-S684JD3ZQE",
};

// Initialize Firebase
const app = getApps.length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage();

const provider = new GoogleAuthProvider();

export { db, auth, provider, storage };

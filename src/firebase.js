import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK8lycEU5N7F-c7rsBOQQm7VGqhNFkTOQ",
  authDomain: "eventraauth.firebaseapp.com",
  projectId: "eventraauth",
  storageBucket: "eventraauth.firebasestorage.app",
  messagingSenderId: "370193236191",
  appId: "1:370193236191:web:c3c11277d09678d43a696a",
};

//this initializes the firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore, auth };

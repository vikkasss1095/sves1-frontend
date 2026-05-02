import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_REAL_KEY",
  authDomain: "PASTE_DOMAIN",
  projectId: "PASTE_ID",
  storageBucket: "PASTE_BUCKET",
  messagingSenderId: "PASTE_MSG_ID",
  appId: "PASTE_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
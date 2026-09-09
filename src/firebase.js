import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBR3tx4srzDLR6n2UyI6YlMgdBKeOZNXJg",
  authDomain: "skill-connect-cc2c8.firebaseapp.com",
  projectId: "skill-connect-cc2c8",
  storageBucket: "skill-connect-cc2c8.firebasestorage.app",
  messagingSenderId: "782499788124",
  appId: "1:782499788124:web:6097ba559cceded7ccfd99"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
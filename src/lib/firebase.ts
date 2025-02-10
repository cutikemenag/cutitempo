import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOO5hVV-UQ4BFY7-NoUkxmH-jFXEoAb4Q",
  authDomain: "cuti-d9723.firebaseapp.com",
  projectId: "cuti-d9723",
  storageBucket: "cuti-d9723.firebasestorage.app",
  messagingSenderId: "146899307807",
  appId: "1:146899307807:web:c00dad2e032d1c7320742a",
  measurementId: "G-LB98S41XXK",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

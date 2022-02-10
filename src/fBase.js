import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID,
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  export const authService = getAuth(firebaseApp);
  export const fireBaseInstance = firebaseApp;
  export const dbService = getFirestore();
  export default firebaseApp;
 
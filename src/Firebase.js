import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjk5end0QWWeVShsNhtpHNi7Fxwg2J2-I",
  authDomain: "onlyfriends-22034.firebaseapp.com",
  projectId: "onlyfriends-22034",
  storageBucket: "onlyfriends-22034.appspot.com",
  messagingSenderId: "914873380613",
  appId: "1:914873380613:web:db352b20867436c9d5d16c"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const storage = getStorage();
export const db = getFirestore();
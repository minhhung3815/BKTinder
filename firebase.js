// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUdpn9mM6ZydoSLoE7orHByTu2r6N0Cfg",
    authDomain: "proskillapp.firebaseapp.com",
    projectId: "proskillapp",
    storageBucket: "proskillapp.appspot.com",
    messagingSenderId: "341640195054",
    appId: "1:341640195054:web:327213b86a35f95a92bcff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db}

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtrIpELUp-es_g2MD5VItI3vnASTGJY5g",
  authDomain: "hspantryapp-d1858.firebaseapp.com",
  projectId: "hspantryapp-d1858",
  storageBucket: "hspantryapp-d1858.appspot.com",
  messagingSenderId: "771409859075",
  appId: "1:771409859075:web:ac68f7cbcf8ba6e333f436"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { firestore, storage };
    

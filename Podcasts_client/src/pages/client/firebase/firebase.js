// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { environment } from './environment'; // Đảm bảo đường dẫn tới file environment đúng

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { storage };

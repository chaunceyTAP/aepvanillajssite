// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAkX9vM0SfqKJmx2xbzYoEq8SjCjAbyDrk',
  authDomain: 'aep-project-eb6b4.firebaseapp.com',
  projectId: 'aep-project-eb6b4',
  storageBucket: 'aep-project-eb6b4.firebasestorage.app',
  messagingSenderId: '810654794951',
  appId: '1:810654794951:web:fea774949c7e8edda12ae2',
  measurementId: 'G-NYZ8FGYDSN',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js'
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
const messaging = getMessaging(app)
getToken(messaging, {
  vapidKey:
    'BJNAl-xOuYkL8VUSNxqVpVDHHwk63TCSk-n8rfdjmCuftqzVtg1LtpXJvXjiAQyozBUCb25Vv2DFP72phYRA2TU',
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log(currentToken)
    } else {
      // Show permission request UI
      console.log(
        'No registration token available. Request permission to generate one.'
      )
      // ...
    }
  })
  .catch((err) => {
    console.log('An error occurred while retrieving token. ', err)
    // ...
  })

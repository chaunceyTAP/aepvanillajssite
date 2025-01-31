// Import Firebase scripts
// importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js')
// importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js')

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js'
// import { getMessaging, onMessage } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAkX9vM0SfqKJmx2xbzYoEq8SjCjAbyDrk',
  authDomain: 'aep-project-eb6b4.firebaseapp.com',
  projectId: 'aep-project-eb6b4',
  storageBucket: 'aep-project-eb6b4.firebasestorage.app',
  messagingSenderId: '810654794951',
  appId: '1:810654794951:web:fea774949c7e8edda12ae2',
  measurementId: 'G-NYZ8FGYDSN',
}

// firebase.initializeApp(firebaseConfig)
const app = initializeApp(firebaseConfig)
// Get the Firebase Messaging instance
const messaging = getMessaging(app)

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message:',
    payload
  )

  // Customize notification
  const notificationTitle = payload.notification?.title || 'New Message'
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message!',
    icon: payload.notification?.icon || '/icons/icon-192x192.png', // Default icon
  }

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions)
})

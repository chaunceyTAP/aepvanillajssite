import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const messaging = getMessaging()
// Add the public key generated from the console here.
getToken(messaging, {
  vapidKey:
    'BJNAl-xOuYkL8VUSNxqVpVDHHwk63TCSk-n8rfdjmCuftqzVtg1LtpXJvXjiAQyozBUCb25Vv2DFP72phYRA2TU',
})
onMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

const requestPermission = () => {
  console.log('Requesting permission...')
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.')
    }
  })
}

import { getMessaging, getToken } from 'firebase/messaging'

const messaging = getMessaging()
// Add the public key generated from the console here.
getToken(messaging, {
  vapidKey:
    'BJNAl-xOuYkL8VUSNxqVpVDHHwk63TCSk-n8rfdjmCuftqzVtg1LtpXJvXjiAQyozBUCb25Vv2DFP72phYRA2TU',
})
function requestPermission() {
  console.log('Requesting permission...')
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.')
    }
  })
}

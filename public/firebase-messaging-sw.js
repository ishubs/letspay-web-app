
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDzWBtLo7TsSvnjdJ6GatyN1f0D3IooUHk",
    authDomain: "useletspay.firebaseapp.com",
    projectId: "useletspay",
    storageBucket: "useletspay.appspot.com",
    messagingSenderId: "700112150942",
    appId: "1:700112150942:web:f257d5fceb7a56139f768f",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png',
        link: window.location.href
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

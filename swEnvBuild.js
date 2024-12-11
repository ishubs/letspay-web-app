
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env' }); // make sure you have '.env.local' file.

fs.writeFileSync(
  './public/swenv.js',
  `
 const process = {
          env: {
            VITE_FIREBASE_API_KEY: '${process.env.VITE_FIREBASE_API_KEY}',
            VITE_FIREBASE_AUTH_DOMAIN: '${process.env.VITE_FIREBASE_AUTH_DOMAIN}',
            VITE_FIREBASE_PROJECT_ID: '${process.env.VITE_FIREBASE_PROJECT_ID}',
            VITE_FIREBASE_STORAGE_BUCKET: '${process.env.VITE_FIREBASE_STORAGE_BUCKET}',
            VITE_FIREBASE_MESSAGING_SENDER_ID: '${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}',
            VITE_FIREBASE_APP_ID: '${process.env.VITE_FIREBASE_APP_ID}',
            VITE_FIREBASE_MEASUREMENT_ID: '${process.env.VITE_FIREBASE_MEASUREMENT_ID}',
            VITE_FIREBASE_VAPID_KEY: '${process.env.VITE_FIREBASE_VAPID_KEY}'
  }
 }`
);


// VITE_FIREBASE_API_KEY=AIzaSyBCO-Wd-KZBXqvJwGglzxcB5V-jEaBxQiU
// VITE_FIREBASE_AUTH_DOMAIN=letspay-prod-ca99d.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=letspay-prod-ca99d
// VITE_FIREBASE_STORAGE_BUCKET=letspay-prod-ca99d.firebasestorage.app
// VITE_FIREBASE_MESSAGING_SENDER_ID=827144082529
// VITE_FIREBASE_APP_ID=1:827144082529:web:4fe88f08c0d0011547c620
// VITE_FIREBASE_MEASUREMENT_ID=G-6ZX2WY1X8P
// VITE_FIREBASE_VAPID_KEY=BNyKK3EmeKE3lLG9kxVtvbdoI0bHS0Rcxs2-X6-mBeiPc5204CcLA8M5Bx9GMOA7WkQ5Xygi-W0La35Tetfge0M
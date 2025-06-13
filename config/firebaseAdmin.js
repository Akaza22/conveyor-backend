// config/firebaseAdmin.js
const admin = require('firebase-admin');

// Cek apakah variabel lingkungan ada (untuk Vercel)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('../serviceAccountKey.json'); // Fallback untuk development lokal

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
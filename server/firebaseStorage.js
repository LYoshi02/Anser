const admin = require("firebase-admin");

// CHANGE: The path to your service account
const serviceAccount = require("./message-app-76d01-firebase-adminsdk-qs5yp-05e0c8827b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
});

const bucket = admin.storage().bucket();

module.exports = bucket;

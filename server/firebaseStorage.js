const admin = require("firebase-admin");

const serviceAccountString = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
  "base64"
).toString("ascii");
const serviceAccountParsed = JSON.parse(serviceAccountString);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountParsed),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
});

const bucket = admin.storage().bucket();

module.exports = bucket;

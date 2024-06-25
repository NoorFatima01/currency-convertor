// src/firebaseAdmin.ts
import admin from "firebase-admin";
import * as fs from "fs";
import path from "path";

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH || path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
const auth = admin.auth();
export { db, auth };

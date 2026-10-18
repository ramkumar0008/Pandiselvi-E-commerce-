const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let serviceAccount;

// Read Firebase credentials from Render environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    );
  } catch (error) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON."
    );
  }
} else {
  // Local development credentials
  const keyPath = path.join(
    __dirname,
    "serviceAccountKey.json"
  );

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      "Firebase credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_JSON on Render."
    );
  }

  serviceAccount = JSON.parse(
    fs.readFileSync(keyPath, "utf8")
  );
}

// Initialize Firebase Admin SDK
if (admin.apps && admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else if (!admin.apps) {
  // Compatibility with modular Firebase Admin SDK exports
  const { initializeApp, getApps, cert } = require("firebase-admin/app");

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

module.exports =
  admin.auth ||
  require("firebase-admin/auth").getAuth;

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let serviceAccount;

// Use Render environment variable in production
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    );
  } catch (error) {
    console.error(
      "Invalid FIREBASE_SERVICE_ACCOUNT_JSON. Check the JSON format."
    );
    throw error;
  }
} else {
  // Use the local JSON file during development
  const serviceAccountPath = path.join(
    __dirname,
    "serviceAccountKey.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      "Firebase credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_JSON on Render or provide serviceAccountKey.json locally."
    );
  }

  serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin.auth();

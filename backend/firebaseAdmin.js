const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let serviceAccount;

// Load credentials from Render or local development
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    );
  } catch (error) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON contains invalid JSON."
    );
  }
} else {
  const keyPath = path.join(__dirname, "serviceAccountKey.json");

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      "Firebase credentials are missing. Configure FIREBASE_SERVICE_ACCOUNT_JSON."
    );
  }

  serviceAccount = JSON.parse(
    fs.readFileSync(keyPath, "utf8")
  );
}

// Confirm that the service account belongs to the expected project
if (serviceAccount.project_id !== "pandiselvi-e-commerce") {
  throw new Error(
    `Wrong Firebase project in service account: ${serviceAccount.project_id}`
  );
}

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the initialized Auth instance
module.exports = admin.auth();
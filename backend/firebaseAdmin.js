const fs = require("fs");
const path = require("path");

const {
  initializeApp,
  getApps,
  cert,
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

let serviceAccount;

// Read credentials from Render environment variables
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

if (!serviceAccount.project_id) {
  throw new Error(
    "Firebase service-account JSON is missing project_id."
  );
}

if (serviceAccount.project_id !== "pandiselvi-e-commerce") {
  throw new Error(
    `Incorrect Firebase project: ${serviceAccount.project_id}`
  );
}

// Initialize Firebase Admin only once
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Export the initialized Auth instance
module.exports = getAuth();

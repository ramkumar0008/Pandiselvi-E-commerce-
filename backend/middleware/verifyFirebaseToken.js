const auth = require("../firebaseAdmin");

async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is empty",
      });
    }

    const decodedToken = await auth.verifyIdToken(token);

    req.firebaseUser = decodedToken;
    return next();
  } catch (error) {
    console.error("Firebase token verification failed:", {
      code: error.code,
      message: error.message,
    });

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token",
    });
  }
}

module.exports = verifyFirebaseToken;
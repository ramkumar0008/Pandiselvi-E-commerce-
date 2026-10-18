
const User = require("../models/User");

async function requireAdmin(req, res, next) {
  try {
    const uid = req.firebaseUser?.uid;

    if (!uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Only the configured Firebase UID can be an admin.
    if (
      !process.env.ADMIN_FIREBASE_UID ||
      uid !== process.env.ADMIN_FIREBASE_UID
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (!user || user.isAdmin !== true) {
      return res.status(403).json({
        success: false,
        message: "This account is not an admin",
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify admin access",
    });
  }
}

module.exports = requireAdmin;

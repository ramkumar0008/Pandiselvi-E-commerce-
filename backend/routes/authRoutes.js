const express = require("express");
const User = require("../models/user");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

// Save or update Firebase user profile in MongoDB
router.post("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;
    const email = req.firebaseUser.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Firebase account does not have an email",
      });
    }

    const name =
      (typeof req.body.name === "string" && req.body.name.trim()) ||
      req.firebaseUser.name ||
      email.split("@")[0];

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        $set: {
          name,
          email: email.toLowerCase(),
        },
        $setOnInsert: {
          firebaseUid,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "User profile saved successfully in MongoDB",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save user profile",
    });
  }
});

// Get logged-in user's MongoDB profile
router.get("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please save your profile first.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user profile",
    });
  }
});

module.exports = router;


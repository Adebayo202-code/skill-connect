const express = require("express");
const User = require("../models/user");

const router = express.Router();

// =========================================
// CREATE USER
// =========================================
router.post("/", async (req, res) => {
  try {
    const {
      uid,
      name,
      email,
      role,
      location,
      latitude,
      longitude,
      phone,
      profileImage,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user in MongoDB
    const user = await User.create({
      uid,
      name,
      email,
      role,
      location,
      latitude,
      longitude,
      phone,
      profileImage,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// =========================================
// GET ALL USERS
// =========================================
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
});

// =========================================
// GET USER BY FIREBASE UID
// =========================================
router.get("/uid/:uid", async (req, res) => {
  try {
    const user = await User.findOne({
      uid: req.params.uid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by UID error:", error);

    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
});

// =========================================
// UPDATE PROFILE IMAGE
// =========================================
router.patch(
  "/uid/:uid/profile-image",
  async (req, res) => {
    try {
      const { profileImage } = req.body;

      if (!profileImage) {
        return res.status(400).json({
          message: "Profile image URL is required",
        });
      }

      const user = await User.findOneAndUpdate(
        { uid: req.params.uid },
        { profileImage },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "Profile image updated successfully",
        user,
      });
    } catch (error) {
      console.error(
        "Update profile image error:",
        error
      );

      res.status(500).json({
        message: "Failed to update profile image",
        error: error.message,
      });
    }
  }
);

// =========================================
// UPDATE USER LOCATION
// =========================================
router.patch(
  "/uid/:uid/location",
  async (req, res) => {
    try {
      const {
        location,
        latitude,
        longitude,
      } = req.body;

      if (
        !location ||
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({
          message:
            "Location, latitude and longitude are required",
        });
      }

      const user =
        await User.findOneAndUpdate(
          { uid: req.params.uid },
          {
            location,
            latitude,
            longitude,
          },
          { new: true }
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "Location updated successfully",
        user,
      });
    } catch (error) {
      console.error(
        "Update location error:",
        error
      );

      res.status(500).json({
        message: "Failed to update location",
        error: error.message,
      });
    }
  }
);

// =========================================
// GET USER BY MONGODB ID
// =========================================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(
      "Get user by ID error:",
      error
    );

    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
});

module.exports = router;
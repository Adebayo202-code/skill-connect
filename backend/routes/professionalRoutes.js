
const express = require("express");
const Professional = require("../models/professional");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      user,
      skill,
      description,
      experience,
      location,
      latitude,
      longitude,
      hourlyRate,
    } = req.body;

    const existingProfessional = await Professional.findOne({
      user,
    });

    if (existingProfessional) {
      return res.status(400).json({
        message: "Professional profile already exists",
      });
    }

    const professional = await Professional.create({
      user,
      skill,
      description,
      experience,
      location,
      latitude,
      longitude,
      hourlyRate,
    });

    res.status(201).json({
      message: "Professional profile created successfully",
      professional,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create professional profile",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const professionals = await Professional.find()
      .populate(
        "user",
        "name email phone profileImage location latitude longitude"
      );

    res.status(200).json(professionals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get professionals",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const professional = await Professional.findById(
      req.params.id
    ).populate(
      "user",
      "name email phone profileImage location latitude longitude"
    );

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    res.status(200).json(professional);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get professional",
      error: error.message,
    });
  }
});

module.exports = router;


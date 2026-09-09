
const express = require("express");
const JobRequest = require("../models/JobRequest");

const router = express.Router();

// Create a job request
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      professional,
      service,
      description,
      location,
    } = req.body;

    const jobRequest = await JobRequest.create({
      customer,
      professional,
      service,
      description,
      location,
    });

    res.status(201).json({
      message: "Job request created successfully",
      jobRequest,
    });
  } catch (error) {
    console.error(
      "Create job request error:",
      error
    );

    res.status(500).json({
      message: "Failed to create job request",
      error: error.message,
    });
  }
});

// Get all job requests
router.get("/", async (req, res) => {
  try {
    const requests = await JobRequest.find()
      .populate(
        "customer",
        "name email phone profileImage location"
      )
      .populate(
        "professional",
        "name email phone profileImage location"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(
      "Get all job requests error:",
      error
    );

    res.status(500).json({
      message: "Failed to get job requests",
      error: error.message,
    });
  }
});

// Get job requests for a specific professional
router.get(
  "/professional/:userId",
  async (req, res) => {
    try {
      const requests = await JobRequest.find({
        professional: req.params.userId,
      })
        .populate(
          "customer",
          "name email phone profileImage location"
        )
        .populate(
          "professional",
          "name email phone profileImage location"
        )
        .sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (error) {
      console.error(
        "Get professional job requests error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get professional job requests",
        error: error.message,
      });
    }
  }
);

// Get job requests for a specific customer
router.get(
  "/customer/:userId",
  async (req, res) => {
    try {
      const requests = await JobRequest.find({
        customer: req.params.userId,
      })
        .populate(
          "customer",
          "name email phone profileImage location"
        )
        .populate(
          "professional",
          "name email phone profileImage location"
        )
        .sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (error) {
      console.error(
        "Get customer job requests error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get customer job requests",
        error: error.message,
      });
    }
  }
);

// Get one job request
router.get("/:id", async (req, res) => {
  try {
    const request = await JobRequest.findById(
      req.params.id
    )
      .populate(
        "customer",
        "name email phone profileImage location"
      )
      .populate(
        "professional",
        "name email phone profileImage location"
      );

    if (!request) {
      return res.status(404).json({
        message: "Job request not found",
      });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(
      "Get one job request error:",
      error
    );

    res.status(500).json({
      message: "Failed to get job request",
      error: error.message,
    });
  }
});

// Update job request status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid job request status",
      });
    }

    const request =
      await JobRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
        .populate(
          "customer",
          "name email phone profileImage location"
        )
        .populate(
          "professional",
          "name email phone profileImage location"
        );

    if (!request) {
      return res.status(404).json({
        message: "Job request not found",
      });
    }

    res.status(200).json({
      message: "Job request status updated",
      request,
    });
  } catch (error) {
    console.error(
      "Update job request status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update job request",
      error: error.message,
    });
  }
});

module.exports = router;


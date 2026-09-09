const express = require("express");
const Message = require("../models/message");

const router = express.Router();

// Send a message
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// Get messages between two users
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get messages",
      error: error.message,
    });
  }
});

// Mark a message as read
router.patch("/:id/read", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
});

module.exports = router;

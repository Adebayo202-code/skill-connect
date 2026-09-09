
const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },

    hourlyRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Professional = mongoose.model(
  "Professional",
  professionalSchema
);

module.exports = Professional;



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const professionalRoutes = require("./routes/professionalRoutes");
const jobRequestRoutes = require("./routes/jobRequestRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/job-requests", jobRequestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "SkillConnect backend is running",
  });
});

const PORT = process.env.PORT || 2300;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });


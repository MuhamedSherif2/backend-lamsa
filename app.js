require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middlewares
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is Running 🚀",
    });
});

// Routes
app.use("/api", router);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import reviewRoute from "./routes/review.route.js";
import messageRoute from "./routes/message.route.js";
import authRoute from "./routes/auth.route.js"; // ✅

import createError from "./utils/createError.js";

// Load .env variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.set('strictQuery', true);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ MongoDB connection successful");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is running — backend connected!");
});

// ✅ FIXED: Route middlewares
app.use("/api/auth", authRoute); // 👈 FIXED HERE
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send({ message: errorMessage });
});

// Start Server
app.listen(8800, () => {
  connect();
  console.log("🚀 Backend server is running on port 8800");
});

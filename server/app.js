import express from "express";
import cors from "cors";
import { pool } from "./src/config/db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running 🚀",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1");
    connection.release();
    res.json({
      success: true,
      message: "Server is healthy",
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: "disconnected"
    });
  }
});

export default app;
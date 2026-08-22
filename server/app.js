import express from "express";
import cors from "cors";
import { pool } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import tripRoutes from "./src/routes/trip.routes.js";
import budgetRoutes from "./src/routes/budget.routes.js";
import cityRoutes from "./src/routes/city.routes.js";
import shareRoutes from "./src/routes/share.routes.js";
import itineraryRoutes from "./src/routes/itinerary.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", itineraryRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips", budgetRoutes);
app.use("/api/trips", shareRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/activities", activityRoutes);

export default app;
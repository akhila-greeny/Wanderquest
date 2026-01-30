require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =====================
// 🌐 Middleware
// =====================
app.use(cors());

// ✅ Allow larger request bodies (for image uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// =====================
// 🛣️ Routes
// =====================
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); // ✅ FIXED PATH — was /api before

const tripRoutes = require("./routes/tripRoutes");
app.use("/api/trips", tripRoutes);

// =====================
// 💾 MongoDB Connection
// =====================
mongoose
  .connect("mongodb://localhost:27017/wanderquest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// =====================
// 🧪 Test Route
// =====================
app.get("/", (req, res) => {
  res.send("🌍 WanderQuest Backend Working ✅");
});

// =====================
// 🚀 Start Server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

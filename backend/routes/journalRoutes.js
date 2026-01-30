const express = require("express");
const Journal = require("../models/Journal");
const router = express.Router();

// Add a new journal entry
router.post("/add", async (req, res) => {
  try {
    const { userId, tripId, title, content } = req.body;
    if (!userId || !tripId || !content) {
      return res.status(400).json({ message: "userId, tripId, and content are required" });
    }

    const entry = new Journal({ userId, tripId, title, content });
    await entry.save();
    res.status(201).json({ message: "Journal added ✅", entry });
  } catch (error) {
    console.error("❌ Error adding journal:", error.message);
    res.status(500).json({ message: "Error adding journal" });
  }
});

// Get all journals for a specific trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const entries = await Journal.find({ tripId: req.params.tripId }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching journals:", error.message);
    res.status(500).json({ message: "Error fetching journals" });
  }
});

// Delete journal
router.delete("/:id", async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Journal deleted ✅" });
  } catch (error) {
    console.error("❌ Error deleting journal:", error.message);
    res.status(500).json({ message: "Error deleting journal" });
  }
});

module.exports = router;

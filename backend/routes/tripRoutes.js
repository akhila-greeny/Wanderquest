const express = require("express");
const Trip = require("../models/Trip");
const axios = require("axios");
const router = express.Router();

// =====================
// Add a Trip
// =====================
router.post("/addTrip", async (req, res) => {
  try {
    const { userId, title, location, notes } = req.body;

    if (!title?.trim() || !location?.trim())
      return res
        .status(400)
        .json({ message: "Title and location are required" });

    // Get coordinates from OpenStreetMap
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      { params: { format: "json", q: location } }
    );

    const coordinates = geoResponse.data[0]
      ? {
          lat: parseFloat(geoResponse.data[0].lat),
          lng: parseFloat(geoResponse.data[0].lon),
        }
      : { lat: null, lng: null };

    const trip = await Trip.create({
      userId: userId || "unknown",
      title: title.trim(),
      location: location.trim(),
      notes: notes?.trim() || "",
      coordinates,
      journals: [],
      checkIns: [],
      quests: {}, // ensure quests map exists
      xp: 0,
    });

    res.status(201).json({ message: "Trip added ✅", trip });
  } catch (error) {
    console.error("❌ Error adding trip:", error.message);
    res.status(500).json({ message: "Error adding trip" });
  }
});

// =====================
// Get all trips for a user
// =====================
router.get("/myTrips/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId }).sort({
      _id: -1,
    });
    res.json(trips);
  } catch (error) {
    console.error("❌ Error fetching trips:", error.message);
    res.status(500).json({ message: "Error fetching trips" });
  }
});

// =====================
// Get single trip by ID
// =====================
router.get("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    console.error("❌ Error fetching trip:", error.message);
    res.status(500).json({ message: "Error fetching trip" });
  }
});

// =====================
// Delete trip
// =====================
router.delete("/:tripId", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.tripId);
    res.json({ message: "Trip deleted ✅" });
  } catch (error) {
    console.error("❌ Error deleting trip:", error.message);
    res.status(500).json({ message: "Error deleting trip" });
  }
});

// =====================
// Journals (AUTO BADGES)
// =====================
router.post("/:tripId/journal", async (req, res) => {
  try {
    const { title, content, photo } = req.body;

    if (!content?.trim())
      return res.status(400).json({ message: "Content is required" });

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.journals.push({
      title: title?.trim() || "",
      content: content.trim(),
      photo: photo || "",
      date: new Date(),
    });

    // AUTO QUEST: Journalist
    if (!trip.quests.get("journal_written")) {
      trip.quests.set("journal_written", true);
      trip.xp = (trip.xp || 0) + 100;
    }

    // AUTO QUEST: Memory Keeper (journal + photo)
    if (photo && !trip.quests.get("memory_keeper")) {
      trip.quests.set("memory_keeper", true);
      trip.xp = (trip.xp || 0) + 100;
    }

    await trip.save();
    res.json({ message: "Journal added + quests updated", trip });
  } catch (error) {
    console.error("❌ Error adding journal:", error.message);
    res.status(500).json({ message: "Error adding journal" });
  }
});

// =====================
// Edit Journal
// =====================
router.put("/:tripId/journal/:journalId", async (req, res) => {
  try {
    const { title, content, photo } = req.body;
    if (!content?.trim())
      return res.status(400).json({ message: "Content cannot be empty" });

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const journal = trip.journals.id(req.params.journalId);
    if (!journal)
      return res.status(404).json({ message: "Journal not found" });

    journal.title = title?.trim() || journal.title;
    journal.content = content.trim();
    journal.photo = photo || "";

    await trip.save();
    res.json({ message: "Journal updated ✅", trip });
  } catch (error) {
    console.error("❌ Error updating journal:", error.message);
    res.status(500).json({ message: "Error updating journal" });
  }
});

// =====================
// Delete Journal
// =====================
router.delete("/:tripId/journal/:journalId", async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      { $pull: { journals: { _id: req.params.journalId } } },
      { new: true }
    );

    if (!updatedTrip)
      return res.status(404).json({ message: "Trip not found" });

    res.json({ message: "Journal deleted ✅", trip: updatedTrip });
  } catch (error) {
    console.error("❌ Error deleting journal:", error.message);
    res.status(500).json({ message: "Error deleting journal" });
  }
});

// =====================
// Check-Ins (AUTO BADGES)
// =====================
router.post("/:tripId/checkin", async (req, res) => {
  try {
    const { note } = req.body;
    if (!note?.trim())
      return res.status(400).json({ message: "Note cannot be empty" });

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const now = new Date();
    trip.checkIns.push({ note: note.trim(), date: now });

    // AUTO QUEST: Friendly Traveler
    const friendlyWords = ["talked", "met", "helped", "local", "friend"];
    if (
      friendlyWords.some((w) => note.toLowerCase().includes(w)) &&
      !trip.quests.get("friendly")
    ) {
      trip.quests.set("friendly", true);
      trip.xp = (trip.xp || 0) + 100;
    }

    // AUTO QUEST: Sunset Chaser
    const hour = now.getHours();
    if (hour >= 18 && hour <= 19 && !trip.quests.get("sunset")) {
      trip.quests.set("sunset", true);
      trip.xp = (trip.xp || 0) + 100;
    }

    await trip.save();
    res.json({ message: "Check-in added + quests updated", trip });
  } catch (error) {
    console.error("❌ Error adding check-in:", error.message);
    res.status(500).json({ message: "Error adding check-in" });
  }
});

// =====================
// Update XP (Manual)
// =====================
router.put("/updateXP/:tripId", async (req, res) => {
  try {
    const { xp } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.xp = (trip.xp || 0) + xp;
    await trip.save();

    res.json({ message: "Trip XP updated ✅", xp: trip.xp });
  } catch (error) {
    console.error("Error updating XP:", error);
    res.status(500).json({ message: "Error updating trip XP" });
  }
});

// =====================
// Manual Quest Completion (fallback)
// =====================
router.put("/:tripId/quest", async (req, res) => {
  try {
    const { questName } = req.body;

    if (!questName)
      return res.status(400).json({ message: "Quest name is required" });

    const trip = await Trip.findById(req.params.tripId);
    if (!trip)
      return res.status(404).json({ message: "Trip not found" });

    if (!trip.quests.get(questName)) {
      trip.quests.set(questName, true);
      trip.xp = (trip.xp || 0) + 100;
    }

    await trip.save();
    res.json({ message: "Quest completed", trip });
  } catch (error) {
    console.error("Error updating quest:", error);
    res.status(500).json({ message: "Error updating quest" });
  }
});

module.exports = router;

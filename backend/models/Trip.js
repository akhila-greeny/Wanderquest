const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  content: { type: String, required: true },
  photo: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const CheckInSchema = new mongoose.Schema({
  note: { type: String, default: "Checked in!" },
  date: { type: Date, default: Date.now },
});

const TripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String, default: "" },
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  journals: [JournalSchema],
  checkIns: [CheckInSchema],

  // ✅ new fields for quests + XP
  quests: {
    type: Map,
    of: Boolean,
    default: {},
  },
  xp: { type: Number, default: 0 },
});

module.exports = mongoose.model("Trip", TripSchema);

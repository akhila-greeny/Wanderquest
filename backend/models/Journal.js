const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tripId: { type: String, required: true },
  title: { type: String, default: "" },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Journal", journalSchema);

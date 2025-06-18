const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  fileName: String,
  timestamp: Date,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ url: String, reason: String }]
});

module.exports = mongoose.model("ImportLog", logSchema);

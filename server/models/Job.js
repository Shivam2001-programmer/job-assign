const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  guid: { type: String, unique: true },
  title: String,
  link: String
});

module.exports = mongoose.model("Job", jobSchema);

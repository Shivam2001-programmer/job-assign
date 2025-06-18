const express = require("express");
const router = express.Router();
const Log = require("../models/ImportLog");
const Job = require("../models/Job");


router.get("/logs", async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 });
  res.json(logs);
});


router.get("/jobs", async (req, res) => {
  const jobs = await Job.find().sort({ _id: -1 });
  res.json(jobs);
});

module.exports = router;

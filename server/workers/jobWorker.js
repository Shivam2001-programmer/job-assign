const axios = require("axios");
const xml2js = require("xml2js");
const Job = require("../models/Job");
const Log = require("../models/ImportLog");

module.exports = async function(job) {
  const app = require("../index");
  const io = app.get("io");

  const urls = [
    "https://jobicy.com/?feed=job_feed",
    "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time"
  
  ];

  let totalFetched = 0, totalImported = 0, newJobs = 0, updatedJobs = 0, failedJobs = [];

  for (let url of urls) {
    try {
      const res = await axios.get(url);
      const json = await xml2js.parseStringPromise(res.data);
      const items = json.rss.channel[0].item;
      totalFetched += items.length;

      for (const item of items.slice(0, 50)) {
        const guid = item.guid[0];
        const title = item.title[0];
        const link = item.link[0];

        const existing = await Job.findOne({ guid });

        if (existing) {
          await Job.updateOne({ guid }, { title, link });
          updatedJobs++;
        } else {
          await Job.create({ guid, title, link });
          newJobs++;
        }

        totalImported++;
      }
    } catch (err) {
      failedJobs.push({ url, reason: err.message });
    }
  }

  const log = await Log.create({
    fileName: `job_import_${Date.now()}`,
    timestamp: new Date(),
    totalFetched,
    totalImported,
    newJobs,
    updatedJobs,
    failedJobs,
  });

  io.emit("newLog", log);
};

const Queue = require("bull");
const jobWorker = require("../workers/jobWorker");

const queue = new Queue("job-import", process.env.REDIS_URL);
const CONCURRENCY = parseInt(process.env.JOB_CONCURRENCY || "2");

queue.process(CONCURRENCY, async (job) => await jobWorker(job));

module.exports = { queue };

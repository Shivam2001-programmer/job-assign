const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { queue } = require("./queue/jobQueue");
const jobRoutes = require("./routes/jobRoutes");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.set("io", io);
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI);


app.use("/api", jobRoutes);


queue.add("fetchJobs");


cron.schedule("0 * * * *", async () => {
  await queue.add("fetchJobs", {}, { attempts: 3, backoff: 5000 });
});

server.listen(4000, () => console.log("✅ Server running on port 4000"));

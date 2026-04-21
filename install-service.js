const path = require("path");
const { Service } = require("node-windows");

const service = new Service({
  name: "Thai Card Reader Agent",
  description:
    "Reads Thai ID cards and exposes local websocket at 127.0.0.1:4000",
  script: path.join(__dirname, "server.js"),
  execPath: process.execPath,
  wait: 2,
  grow: 0.5,
  maxRetries: 40,
  restartDelay: 5000,
});

service.on("install", () => {
  console.log("Service installed. Starting service...");
  service.start();
});

service.on("alreadyinstalled", () => {
  console.log("Service is already installed.");
});

service.on("start", () => {
  console.log("Service started successfully.");
});

service.on("error", (err) => {
  console.error("Service install/start error:", err);
});

service.install();

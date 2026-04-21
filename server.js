const WebSocket = require("ws");
const http = require("http");
const ThaiIDCardReader =
  require("./node_modules/thai-id-card-reader/build/src/ThaiIDCardReader").default;

const PORT = 4000;
const server = http.createServer();
const wss = new WebSocket.Server({ server, host: "127.0.0.1" });

const reader = new ThaiIDCardReader();
const clients = new Set();

let lastCardData = null;
let readerInitialized = false;

const broadcast = (payload) => {
  const serialized = JSON.stringify(payload);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serialized);
    }
  }
};

const normalizeCardData = (data) => {
  const titleTH = data.titleTH || "";
  const firstNameTH = data.firstNameTH || "";
  const lastNameTH = data.lastNameTH || "";
  const fullNameTH =
    data.fullNameTH ||
    [titleTH, firstNameTH, lastNameTH].filter(Boolean).join(" ").trim();

  return {
    citizenId: data.citizenID || "",
    firstNameTH,
    lastNameTH,
    titleTH,
    fullNameTH,
    address: data.address || "",
    photo: data.photoAsBase64Uri || "",
    issueDate: data.issueDate || "",
    expireDate: data.expireDate || "",
    dateOfBirth: data.dateOfBirth || "",
    gender: data.gender || "",
    cardIssuer: data.cardIssuer || "",
  };
};

const initReader = () => {
  if (readerInitialized) {
    return;
  }

  readerInitialized = true;
  reader.setInsertCardDelay(1000);
  reader.setReadTimeout(5000);

  reader.onReadComplete((data) => {
    const normalized = normalizeCardData(data || {});
    lastCardData = normalized;

    console.log("📤 Card read complete:", {
      citizenId: normalized.citizenId,
      fullNameTH: normalized.fullNameTH,
    });

    broadcast(normalized);
  });

  reader.onReadError((error) => {
    const message = typeof error === "string" ? error : String(error);
    console.error("❌ Thai ID card read error:", message);
    broadcast({
      Message: "ReadErrorE",
      Status: -1,
      error: message,
    });
  });

  reader.init();
};

console.log(`🟢 Thai Card Reader Agent starting on port ${PORT}...`);

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("✅ Client connected. Sending AgentStatusE...");

  ws.send(
    JSON.stringify({
      Message: "AgentStatusE",
      Status: 1,
    }),
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📥 Received Command: ${data.Command}`);

      if (data.Command === "GetReaderList") {
        ws.send(
          JSON.stringify({
            Message: "GetReaderListR",
            Status: 0,
            ReaderList: ["PC/SC Reader"],
          }),
        );
      }

      if (data.Command === "SelectReader") {
        ws.send(
          JSON.stringify({
            Message: "SelectReaderR",
            Status: 0,
          }),
        );
      }

      if (data.Command === "ReadIDCard" && lastCardData) {
        // ส่งข้อมูลล่าสุดเฉพาะเมื่อเว็บร้องขอ explicit command เท่านั้น
        ws.send(JSON.stringify(lastCardData));
      }
    } catch (err) {
      console.error("❌ Error parsing message:", err.message);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("🔌 Client disconnected");
  });

  ws.on("error", (err) => {
    clients.delete(ws);
    console.error("❌ WebSocket error:", err.message);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`🎯 Thai Card Reader Agent listening on ws://127.0.0.1:${PORT}`);
  console.log("");
  console.log("📝 ใช้งาน:");
  console.log("   1. เปิด agent นี้ไว้");
  console.log("   2. เปิดหน้าเว็บ OnsiteRegister2");
  console.log("   3. เสียบบัตรประชาชนไทย");
  console.log("   4. ข้อมูลจะถูกส่งเข้าเว็บอัตโนมัติ");
  console.log("");

  initReader();
});

process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  }

  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

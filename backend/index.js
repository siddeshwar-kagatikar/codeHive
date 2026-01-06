require("dotenv").config();

const connectToMongo = require("./db");
const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("./routes/socket");

connectToMongo();

const app = express();

app.use(cors({
  origin: "https://code-hive-nu.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "auth-token"]
}));

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/question", require("./routes/questions"));
app.use("/api/code", require("./routes/code"));

// HTTP + Socket.IO
const server = http.createServer(app);
initializeSocket(server);

// IMPORTANT: use Render-provided port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

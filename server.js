const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-rho-liard.vercel.app",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname));

const CHAT_PASSWORD = process.env.CHAT_PASSWORD;

io.use((socket, next) => {
  if (!CHAT_PASSWORD) {
    return next(new Error("Server password not set"));
  }
  const { password } = socket.handshake.auth || {};
  if (password === CHAT_PASSWORD) {
    return next();
  }
  return next(new Error("Invalid password"));
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  io.emit("online users", io.engine.clientsCount);

  socket.on("disconnect", () => {
    io.emit("online users", io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

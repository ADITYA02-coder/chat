const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname)); // Serve your HTML file

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    // Broadcast the message with ID and text
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const CLIENT_URL = process.env.NODE_CLIENT_URL;

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
io.on("connection", (socket) => {
  socket.on("room", (roomId) => {
    console.log(socket.handshake.query.user + " Connected");
    if (roomId.length > 0) {
      socket.on(roomId, (msg) => {
        io.emit(roomId, msg);
      });
    }
  });
});

server.listen(3001, (err) => {
  if (err) console.log("Some Error Occured", err);
  console.log("Listening at 3001");
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  const user = socket.handshake.query.user;
  console.log(user + " Connected");

  socket.on("new-message", (data) => {
    io.emit(data.roomId, data);
  });

  socket.on("disconnect", (data) => {
    io.emit("onDisconnect", `${user} Disconnected`);
    console.log(`${user} Disconnected`);
  });
});

app.get("*", (req, res) => {
  return res.json({ info: "You have reached here" });
});

server.listen(process.env.PORT, (err) => {
  if (err) console.log("Some Error Occured", err);
  console.log(`Listening at ${process.env.PORT}`);
});

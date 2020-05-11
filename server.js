const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

io.on("connection", (socket) => {
  socket.on("ready", (data) => {
    socket.join(data.chat_room);
    socket.join(data.signal_room);
    io.sockets.emit("announce", {
      message: `New client in the ${data.chat_room} room.`,
    });
  });
  socket.on("send", (data) => {
    io.sockets.emit("message", {
      message: data.message,
      author: data.author,
    });
  });
  socket.on("signal", (data) => {
    socket.broadcast.to(data.room).emit("signaling_message", {
      type: data.type,
      message: data.message,
    });
  });
});

http.listen(port, () => {
  console.log(`listening on *: ${port}`);
});

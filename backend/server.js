const express = require("express");
const app = express();
const { chats } = require("./data/dummydata");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageroutes");
const { notFound, errorHandler } = require("./services/errorHandling");
const path = require("path");

dotenv.config();

connectDB();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//Deployment

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/chatfrontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "chatfrontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

//Deployment

app.use(notFound);
app.use(errorHandler);

const Port = process.env.PORT || 5000;

const server = app.listen(
  Port,
  console.log(`Server is running on Port ${Port}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`room: ${room}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.user are not defined ");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("Disconnected");
    socket.leave(userData._id);
  });
});

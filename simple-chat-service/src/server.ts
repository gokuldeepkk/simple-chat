import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const users: { [key: string]: string } = {};
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("user-connect", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", { message, user: users[socket.id] });
  });
});

const PORT = 4200;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

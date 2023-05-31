const http = require("http");
const { MongoClient } = require("mongodb");

const app = require("./app");

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  // Xử lý sự kiện khi người dùng kết nối (connection)
  console.log("A user connected.");

  // Khi người dùng tham gia vào ứng dụng
  socket.on("user join", (userId) => {
    users[socket.id] = userId; // Lưu trữ thông tin người dùng
  });

  // Xử lý sự kiện ngắt kết nối của client
  socket.on("disconnect", () => {
    delete users[socket.id];
    
  console.log("A user disconnected.");
  });

  // Gửi tin nhắn tới người dùng cụ thể
  socket.on("chat message", ({ userId, message }) => {
    // Tìm socketId tương ứng với userId từ danh sách người dùng
    const socketId = Object.keys(users).find((id) => users[id] === userId);

    if (socketId) {
      io.to(socketId).emit("chat message", message); // Gửi tin nhắn chỉ đến người dùng cụ thể
    }
  });
});

async function startServer() {
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send the socket ID to the connected client
  socket.emit("me", socket.id);

  // Handle call initiation
  socket.on("callUser", ({ userToCall, signalData, from }) => {
    if (!userToCall || !signalData || !from) {
      console.error("Invalid callUser data:", { userToCall, signalData, from });
      return socket.emit("callError", { message: "Invalid call data." });
    }

    const targetSocket = io.sockets.sockets.get(userToCall);
    if (targetSocket) {
      io.to(userToCall).emit("callUser", { signal: signalData, from });
    } else {
      console.error(`User ${userToCall} not found.`);
      socket.emit("callError", { message: "User not found or offline." });
    }
  });

  // Handle call acceptance
  socket.on("answerCall", (data) => {
    if (!data || !data.to || !data.signal) {
      console.error("Invalid answerCall data:", data);
      return socket.emit("callError", { message: "Invalid answer data." });
    }

    const targetSocket = io.sockets.sockets.get(data.to);
    if (targetSocket) {
      io.to(data.to).emit("callAccepted", data.signal);
    } else {
      console.error(`Caller ${data.to} not found.`);
      socket.emit("callError", { message: "Caller not found or offline." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  io.close(() => {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  io.close(() => {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
});

server.listen(5001, () => console.log("Server running on port 5001"));
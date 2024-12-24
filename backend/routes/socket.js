// socket.js
const { Server } = require('socket.io');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Adjust this to your frontend's URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle updates for a question
    socket.on('update-question', (data) => {
      io.emit('question-updated', data); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;

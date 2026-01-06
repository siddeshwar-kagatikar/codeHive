const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      // origin: "http://localhost:3000", // Adjust this to your frontend's URL
      origin: "https://code-hive-nu.vercel.app",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });

    socket.on('send_message', (data) => {
      console.log('Message from client:', data);
      socket.broadcast.emit('receive_message', data); // Broadcast message to all other clients
    });

    socket.on('send_question', (data) => {
      console.log('Edited question from client:', data);
      socket.broadcast.emit('receive_question', data); // Broadcast question to all other clients
    });

    socket.on('send_code', (data)=>{
      console.log("code from user: ",data);
      socket.broadcast.emit('receive_code', data);
    })
  });

  return io;
};



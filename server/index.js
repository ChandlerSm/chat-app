const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
    console.log("A user has connected.");

    socket.on('message', (data) => {
        console.log("Got message", data);
        // Emit the message to all connected clients
        io.emit('message', { username: data.name, final_message: data.message });
    });

    socket.on('disconnect', () => {
        console.log("A user has disconnected.");
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

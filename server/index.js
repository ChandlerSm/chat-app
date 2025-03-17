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


    let username = "";
    socket.on('message', (data) => {
        console.log("Got message", data);
        // Emit the message to all connected clients
        username = data.name;
        io.emit('message', { username: data.name, final_message: data.message });
    });

    socket.on('disconnect', (data) => {
        console.log("A user has disconnected.");
        if (username) {
          io.emit('message', { username: data.name, final_message: username + " has disconnected." });
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

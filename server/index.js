const e = require("express");
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Used to connect the websockets
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

// Pulling backend data from SQLite database
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) {
    console.log("Error connecting to DB");
  }
  else {
    console.log("Connected to db.")
  }
});

// Return a list of all messages, mainly for testing
const getAllMessages = () => {
db.all("SELECT * FROM message", (err, rows) => {
  if (err) {
    console.log("Could not query messages")
  }
  else {
    console.log("All messages:", rows);
  }
});
}

// Return a list of all chats, mainly for testing
const getAllChats = () => {
  db.all("SELECT * FROM chat", (err, rows) => {
    if (err) {
      console.log("Could not query chat")
    }
    else {
      console.log("All chats:", rows);
    }
  });
}

// Return a list of all partipents in each chat, mainly for testing
const getAllParticipants = () => {
  db.all("SELECT * FROM chat_participants", (err, rows) => {
    if (err) {
      console.log("Could not query participants")
    }
    else {
      console.log("All participants:", rows);
    }
  });
}

// Create a chat
const createChat = (chat_name) => {
  db.exec(`INSERT INTO chat (name) VALUES ('${chat_name}'); 
  INSERT INTO chat_participants (chat_id, name) VALUES (2, 'Gray');`, (err) => {
    if (err) {
      console.log("Could not insert chat");
    }
    else {
      console.log("Inserted new chat name");
    }
  })
  }

// Add a user into the chat
const addParticipants = (chat_id, name) => {
  if (name.length === 0) {
    console.log("No users in the list");
  } else {
    for (let i = 0; i < name.length; i++) {
      db.exec(`INSERT INTO chat_participants (chat_id, name) VALUES ('${chat_id}', '${name[i]}');`, (err) => {
        if (err) {
          console.log("Could not insert participant: ", err);
        } else {
          console.log(`Successfully added participant ${name[i]} at ${chat_id}`);
        }
      });
    }
  }
};


createChat("test chat 3");
addParticipants(2, ["Red", "Blue"]);
getAllMessages();
getAllChats();
getAllParticipants();

// Close the database
// db.close((err) => {
//   if (err) {
//       console.error('Error closing database connection:', err.message);
//   } else {
//       console.log('Closed the SQLite database connection.');
//   }
// });

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

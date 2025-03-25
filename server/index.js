const { rejects } = require("assert");
const e = require("express");
const express = require("express");
const http = require('http');
const { resolve } = require("path");
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const cors = require("cors");
app.use(cors());


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
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM chat", (err, rows) => {
      if (err) {
        console.log("Could not query chat");
        reject(err);
      }
      else {
        console.log("All chats:", rows);
        resolve(rows);
      }
    });
  });
}

// Place holder username for testing, should pull from frontend to get username
// const username = "Alice";

// Pulls from db to get all the current users chats
const getUserChats = (username) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM chat_participants WHERE name = ?`, [username], (err, participants) => {
      if (err) return reject(err);

      // Extract chat IDs
      const chatIds = participants.map(p => p.chat_id);

      if (chatIds.length === 0) {
        return resolve([]); // User is not in any chats
      }

      // Query each chat by ID
      const placeholders = chatIds.map(() => '?').join(', ');
      const query = `SELECT * FROM chat WHERE id IN (${placeholders})`;

      db.all(query, chatIds, (err, chats) => {
        if (err) return reject(err);
        // resolve(chats);

        // Get latest message of each chat
        // Selects chat_id, name, message, timestamp of message table
        // Joins together the values into latestMsg, with the highest timestamp to get the latest message
        const lastMessageQuery = `SELECT m.chat_id, m.name, m.message, m.timestamp
        FROM message m
        INNER JOIN (
          SELECT chat_id, MAX(timestamp) AS latest 
          FROM message 
          WHERE chat_id IN (${placeholders})
          GROUP by chat_id
        ) latestMsg
         ON m.chat_id = latestMsg.chat_id AND m.timestamp = latestMsg.latest`;

         db.all(lastMessageQuery, chatIds, (err, lastMessage) => {
            if (err) reject(err);
            const result = chats.map(chat => {
              // Find the last message where the chat_id is equal to the message chat id
              const lastMsg = lastMessage.find(msg => msg.chat_id === chat.id);
              return {
                ...chat,
                lastMessage: lastMsg
                ? {
                  name: lastMsg.name,
                  message: lastMsg.message,
                  timestamp: lastMsg.timestamp
              }
              : null
              }
            })
            resolve(result);
         })
      });
    });
  });
};

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
createChat("Test chat 2");
addParticipants(2, ["Red", "Blue", "Alice"]);
getAllMessages();
getAllChats();
getAllParticipants();
// console.log(getUserChats());

// Will send json data of all the chats the user is in.
app.get("/chats", async (req, res) => {
  try {
    const username = req.query.user;
    const chat = await getUserChats(username);
    res.json(chat);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

app.get("/chatMessages", async (req, res) => {
  try {
    const chat_id = req.query.chat_id;
    db.all(`SELECT * FROM message WHERE chat_id = ?`, [chat_id], (err, rows) => {
      if (err) { return err; }
      console.log(rows);
      res.json(rows); 
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
});

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

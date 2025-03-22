DROP TABLE chat;
DROP TABLE chat_participants;
DROP TABLE message;

CREATE TABLE IF NOT EXISTS chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    name TEXT NOT NULL UNIQUE,
    FOREIGN KEY (chat_id) REFERENCES chat(id) -- This will reference to the chat's current id
);

CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chat(id) -- This will reference to the chat's current id
);

INSERT INTO chat (name) VALUES ("Test Chat");

INSERT INTO chat_participants (chat_id, name) -- Inserts chat participants into a specified chat by id.
VALUES 
(1, 'ALice'),
(1, 'Bob'),
(1, 'John');

INSERT INTO message (chat_id, name, message) -- Inserts messages into a specified chat by id.
VALUES 
(1, 'Alice', 'Hello Guys!'),
(1, 'Bob', 'Hello Alice!'),
(1, 'John', 'Hello guys');

SELECT * FROM chat;

SELECT * FROM chat_participants WHERE chat_id = 1;

SELECT * FROM message WHERE chat_id = 1;



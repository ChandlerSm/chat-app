import { useEffect, useRef, useState } from "react";
import "./landing-page.css";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

const ChatPage = () => {
    const [final_message, setFinal_message] = useState("");
    const [all_messages, setAllMessages] = useState([]);
    const dummy = useRef();
    const socket = useRef(null); // To store the socket instance
    const location = useLocation();
    const {username} = location.state ||  {username: "Unknown"};
    const [userChatList, setUserChatList] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(0);
    const [IschatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        // Initialize the socket connection
        getChatList();

        socket.current = io("http://localhost:3000");

        socket.current.on('message', (data) => {
          setAllMessages((prevMessages) => [
            ...prevMessages,
            { name: data.username, message: data.final_message }
          ]);
          getChatList();
        });

        return () => {
        socket.current.disconnect(); // Cleanup on unmount
        };
    }, []);

    const message_input = (message) => {
        setFinal_message(message);
    };

    const getChatList = () => {
      fetch("http://localhost:3000/chats?user=" + username).then(res => res.json())
      .then(data => {console.log("Chat list: ", data); setUserChatList(data)});
    }

    // Will get all messages of a chat when clicked, should update to also return all participants
    const getChatMessages = (chat_id) => {
      setCurrentChatId(chat_id-1);
      setIsChatOpen(true);
      setAllMessages([]);
      console.log("Button clicked");
      fetch("http://localhost:3000/chatMessages?chat_id=" + chat_id).then((res) => res.json())
      .then(data => {console.log(data); setAllMessages(data)})
      .catch ((err) => {
        console.log(err);
      });
    }

    const handleKeydown = (e) => {
        if (e.key === "Enter") {
        console.log(final_message);
        // Use the same socket instance to emit the message
        socket.current.emit('message', { name: username, message: final_message });
        setFinal_message(""); // Clear the input field
        console.log(all_messages)
        dummy.current.scrollIntoView({ behavior: "smooth" });

        fetch("http://localhost:3000/sendMessage", {method: "POST", headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify({name: username, message: final_message, chat_id: currentChatId})
        }).then(res => res.json())
        .then(data => {
          console.log("successfully uploaded message: ", data)
        })
        .catch (err => {
          console.log("Error uploading message", err)
        })
        }
    };

  return (
    <div className="landing-page">
      <div id="chat-names-holder" style={{borderRight: IschatOpen ? "none" : "solid 1px #455f70"}}>
        {userChatList.map((chat, index) => (
          userChatList.length !== 0 ? (
          <div className="left-names-holder" onClick={() => getChatMessages(chat.id)}>
            <p>{chat.name}</p>
            <p>
              {chat.participants.join(", ")}
            </p>
            <p className="last-message">{chat.lastMessage ? `${chat.lastMessage.name}: ${chat.lastMessage.message}` 
            : `No Message Yet`}</p>
            </div>
          ) : (
            null
          )
        ))}
      </div>
      <div id="right-box" style={{ width: IschatOpen ? "75%" : "0%"}}>
      <div id="recipient-name">
          <p style={{ display: IschatOpen ? "block" : "none" }}>{userChatList[currentChatId] ? userChatList[currentChatId].participants.join(", ") : null}</p>
        </div>
      <div id="chat-holder" >
        {all_messages.map((msg, index) => (
          all_messages != null ? (
          msg.name !== username ? (
            <div key={`${msg.name}-${msg.message}-${index}`} className="other-person-message" style={{ width: "100%", gap: "10px" }}>
              <div className="image-user">
              <p>{msg.name}</p>
              </div>
              <p className="other-user-message">{msg.message}</p>
            </div>
          ) : (
            <div key={`${msg.name}-${msg.message}-${index}`} className="your-messages" style={{ width: "100%", gap: "10px" }}>
              <p className="user-message">{msg.message}</p>
              <div className="image-user">
              <p>{msg.name}</p>
              </div>
            </div>
          )
        ) : (
          null
        )
        ))}
        <div ref={dummy} />
      </div>
      <input
          id="message-box"
          type="text"
          value={final_message}
          onChange={(e) => message_input(e.target.value)}
          onKeyDown={handleKeydown}
        />
        </div>
    </div>
  );
};

export default ChatPage;

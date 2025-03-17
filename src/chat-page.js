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
    

    useEffect(() => {
        // Initialize the socket connection
        socket.current = io("http://localhost:3000");

        socket.current.on('message', (data) => {
          setAllMessages((prevMessages) => [
            ...prevMessages,
            { name: data.username, message: data.final_message }
          ]);
        });

        return () => {
        socket.current.disconnect(); // Cleanup on unmount
        };
    }, []);

    const message_input = (message) => {
        setFinal_message(message);
    };

    const handleKeydown = (e) => {
        if (e.key === "Enter") {
        console.log(final_message);
        // Use the same socket instance to emit the message
        socket.current.emit('message', { name: username, message: final_message });
        setFinal_message(""); // Clear the input field
        console.log(all_messages)
        dummy.current.scrollIntoView({ behavior: "smooth" });
        }
    };

  return (
    <div className="landing-page">
      <div id="chat-names-holder">
        <p>{username}</p>
      </div>
      <div id="chat-holder">
        {all_messages.map((msg, index) => (
          msg.name !== username ? (
            <div key={`${msg.name}-${msg.message}-${index}`} className="other-person-message" style={{ width: "100%" }}>
              <p className="user-messages">{msg.message}</p>
            </div>
          ) : (
            <div key={`${msg.name}-${msg.message}-${index}`} className="your-messages" style={{ width: "100%" }}>
              <p className="user-messages">{msg.message}</p>
            </div>
          )
        ))}
        <div ref={dummy} />
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

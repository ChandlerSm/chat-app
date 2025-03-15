import { useEffect, useRef, useState } from "react";
import "./landing-page.css"

const ChatPage = ({name}) => {
    const [final_message, setFinal_message] = useState("");
    const [all_messages, setAllMessages] = useState([{"name": "Bob", "message": "Test"}]);
    const [username, setUsername] = useState("Alice");
    const dummy = useRef();

    const message_input = (message) => {
        setFinal_message(message);
    };

    const handleKeydown = (e) => {
        if (e.key == "Enter") {
            console.log(final_message);
            setAllMessages((prevMessages) => [
                ...prevMessages,
                { name: username, message: final_message }
            ]);
            setFinal_message(""); // Clear the input field
            dummy.current.scrollIntoView({ behavior: "smooth"});
        }
    }

    return (
        <div className="landing-page">
            <div id="chat-names-holder"> {/* Div for the side bar to change chats */}
                <p>{name}</p>
            </div>
            <div id="chat-holder"> {/* The div for the whole chat box */}
            {all_messages.map((msg, index) => (
                    msg.name !== username ? (
                    <div key={`${msg.name}-${msg.message}`} className="other-person-message" style={{ width: "100%" }}> {/* Div for other person's incoming messages */}
                        <p className="user-messages">{msg.message}</p>
                    </div>
                    ) : (
                    <div key={`${msg.name}-${msg.message}`} className="your-messages" style={{ width: "100%" }}>  {/* Div for your own sent messages */}
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
    )
}

export default ChatPage;
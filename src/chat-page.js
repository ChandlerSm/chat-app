import "./landing-page.css"

const ChatPage = ({name}) => {
    return (
        <div className="landing-page">
            <div id="chat-names-holder"> {/* Div for the side bar to change chats */}
                <p>{name}</p>
            </div>
            <div id="chat-holder"> {/* The div for the whole chat box */}
                <div id="other-person-message" style={{width: "100%"}}> {/* Div for other person's incoming messages */}
                    <p className="user-messages">Test Message</p> 
                </div>

                <div id="your-messages" style={{width: "100%"}}>  {/* Div for your own sent messages */}
                    <p className="user-messages">Test Message</p> 
                </div>
                <div id="message-box" aria-placeholder="Type here"></div> {/* Box to input your own message to send */}
            </div>
        </div>
    )
}

export default ChatPage;
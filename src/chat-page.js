import "./landing-page.css"

const ChatPage = ({name}) => {
    return (
        <div className="landing-page">
            <div id="chat-names-holder">
                <p>{name}</p>
            </div>
            <div id="chat-holder">
            <p>
                Chat's holder
            </p>
            </div>
        </div>
    )
}

export default ChatPage;
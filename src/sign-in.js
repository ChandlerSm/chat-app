import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")

    const handleSignin = () => {
        if (username) {
            navigate("/chat-page", {state: {username}})
        }
    }

    return (
        <div id="sign-in-holder" style={{width: "90%"}}>
                <input
                    id="message-box"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={handleSignin} />
        </div>
    )
}

export default SignIn;
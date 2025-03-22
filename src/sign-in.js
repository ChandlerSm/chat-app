import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sign-in.css";

const SignIn = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")

    const handleSignin = () => {
        if (username) {
            navigate("/chat-page", {state: {username}})
        }
    }

    const handle_keySignin = (e) => {
        if (e.key === "Enter") {
            handleSignin(e.target.value)
        }
    }

    return (
        <div id="sign-in-holder" style={{width: "100%"}}>
            <div id="inner-holder">
                <h1>Input Username</h1>
                <input
                    id="sign-in-box"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handle_keySignin}
                />
                <button id="signin-button" onClick={handleSignin}> Login </button>
                </div>
        </div>
    )
}

export default SignIn;
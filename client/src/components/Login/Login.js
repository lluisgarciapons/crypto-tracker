import React from "react";
import useInput from "../reusable/useInput";

const Login = () => {
    const [username, userInput] = useInput({ type: "text" });
    const [password, passwordInput] = useInput({ type: "password" });

    const handleLogin = () => {

    };

    return <>
        {userInput} to {username} <br />
        {passwordInput} to {password}
        <button className="btn" onClick={handleLogin}>LOGIN</button>
    </>;
};

export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";

function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        if (!email.length && !password.length) {
            return props.showError('Please enter valid username and password');
        }

        props.showError(null);
        const payload = {
            email,
            password
        };
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
            console.log(response);
            if (!response.data.success) {
                return props.showError(response.data.message);
            }
            props.setIsLogin(true);
            localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
            setSuccessMessage('Registration successful. Redirecting to home page..');
            redirectToHome();
            props.showError(null);
        }

        catch (err) {
            console.log(err);
            props.showError(err.response.data.message);
        }

    };

    const redirectToHome = () => {
        props.updateTitle('Crypto-tracker');
        props.history.push('/');
    };
    const redirectToRegister = () => {
        props.updateTitle('Register');
        props.history.push('/register');
    };

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="email">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="password">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-check">
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: successMessage ? 'block' : 'none' }} role="alert">
                {successMessage}
            </div>
            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span>
            </div>
        </div>
    );
}

export default withRouter(LoginForm);
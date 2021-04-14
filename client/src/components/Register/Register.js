import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import "./Register.css";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import axios from "axios";
import setAuthToken from '../../utils/setAuthToken';


function Register(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            sendDetailsToServer();
        } else {
            props.showError('Passwords do not match');
        }
    };

    const sendDetailsToServer = async () => {
        if (!email.length && !password.length) {
            return props.showError('Please enter valid username and password');
        }

        props.showError(null);
        const payload = {
            email,
            password,
            passwordValidation: confirmPassword
        };
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, payload);
            console.log(response);
            if (!response.data.success) {
                return props.showError(response.data.message);
            }
            props.setIsLogin(true);
            setAuthToken(response.data.token);
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
    const redirectToLogin = () => {
        props.updateTitle('Login');
        props.history.push('/login');
    };

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
          </button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: successMessage ? 'block' : 'none' }} role="alert">
                {successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>
        </div>
    );
};

export default withRouter(Register);
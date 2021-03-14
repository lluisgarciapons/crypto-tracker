
import React from 'react';
import "./Header.css";
import { withRouter } from "react-router-dom";
import setAuthToken from '../../utils/setAuthToken';

function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const logout = () => {
        props.setIsLogin(false);
        localStorage.removeItem("jwt_token");
        setAuthToken();

    };


    const title = capitalize(props.location.pathname.substring(1, props.location.pathname.length));
    return (
        <nav className="navbar navbar-dark bg-primary">
            <div className="col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.title || title || "Crypto-tracker"}</span>
                {props.isLogin ? <button className="btn btn-light logout-button" onClick={logout}>logout</button> : ""}
            </div>
        </nav>
    );
}
export default withRouter(Header);
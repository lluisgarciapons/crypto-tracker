import React, { useEffect, useState } from "react";
import './App.css';
import Login from "./components/Login/Login";
import Register from './components/Register/Register';
import Header from './components/Header/Header';
import Home from "./components/Home/Home";
import ModifyCrypto from "./components/ModifyCrypto/ModifyCrypto";
import { API_BASE_URL } from "./constants/apiConstants";
import setAuthToken from "./utils/setAuthToken";
import AlertComponent from './components/AlertComponent/AlertComponent';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import axios from "axios";

function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("jwt_token")) {
      console.log("checking for user");
      autoLogin(localStorage.getItem("jwt_token"));
    }
  }, []);

  const autoLogin = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/auth/currentUser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data.success) {
      setIsLogin(false);
      localStorage.removeItem("jwt_token");
      setAuthToken();
      return;
    }
    setIsLogin(true);
    setAuthToken(localStorage.getItem("jwt_token"));
  };


  return (
    <Router>
      <div className="App">
        <Header title={title} isLogin={isLogin} setIsLogin={setIsLogin} />
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <PrivateRoute path="/" exact={true}>
              <Home showError={updateErrorMessage} updateTitle={updateTitle} />
            </PrivateRoute>
            <Route path="/register">
              <Register showError={updateErrorMessage} updateTitle={updateTitle} setIsLogin={setIsLogin} />
            </Route>
            <Route path="/login">
              <Login showError={updateErrorMessage} updateTitle={updateTitle} setIsLogin={setIsLogin} />
            </Route>
            <PrivateRoute path="/modifyCrypto">
              <ModifyCrypto showError={updateErrorMessage} updateTitle={updateTitle} setIsLogin={setIsLogin} />
            </PrivateRoute>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        </div>
      </div>
    </Router>
  );
}

export default App;

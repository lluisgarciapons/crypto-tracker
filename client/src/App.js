import React, { useState } from "react";
import './App.css';
import Login from "./components/Login/Login";
import Register from './components/Register/Register';
import Header from './components/Header/Header';
import AlertComponent from './components/AlertComponent/AlertComponent';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";

function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <Register showError={updateErrorMessage} updateTitle={updateTitle} />
            </Route>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        </div>
      </div>
    </Router>
  );
}

export default App;

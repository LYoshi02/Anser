import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Chat from "./components/Chat/Chat";
import Home from "./components/Home/Home";
import Landing from "./components/Landing/Landing";
import Login from "./components/Auth/Login/Login";
import Profile from "./components/Profile/Profile";
import Signup from "./components/Auth/Signup/Signup";
import User from "./components/User/User";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuth();

  let routes = null;
  if (currentUser) {
    routes = (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/users/:user" component={User} />
        <Route path="/chats/:user" component={Chat} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return <Router>{routes}</Router>;
}

export default App;
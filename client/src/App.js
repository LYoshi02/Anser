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
import NewGroup from "./components/NewGroup/NewGroup";
import Profile from "./components/Profile/Profile";
import ProfileImage from "./components/Profile/ProfileImage/ProfileImage";
import Signup from "./components/Auth/Signup/Signup";
import SocketListener from "./components/SocketListener/SocketListener";
import User from "./components/User/User";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuth();

  let routes = null;
  if (currentUser) {
    routes = (
      <SocketListener>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/profile/image" component={ProfileImage} />
          <Route path="/users/:user" component={User} />
          <Route path="/chats/:chatId" component={Chat} />
          <Route path="/new-group" component={NewGroup} />
          <Redirect to="/" />
        </Switch>
      </SocketListener>
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

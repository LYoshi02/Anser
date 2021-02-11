import React, { useContext, useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";

import axios from "../axios-instance";
import { chatsAtom } from "../recoil/atoms";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const setChats = useSetRecoilState(chatsAtom);

  function login(userData) {
    return axios
      .post("auth/login", { userData })
      .then((res) => {
        console.log(res);
        const { username, fullname, email, userId, chats } = res.data.user;
        localStorage.setItem("message-app-token", res.data.token);
        setToken(res.data.token);
        setCurrentUser({ username, fullname, email, userId });
        setChats(chats);
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : "Se produjo un error al iniciar sesión";
        throw new Error(message);
      });
  }

  function signup(userData) {
    return axios
      .put("auth/signup", { userData })
      .then((res) => {
        localStorage.setItem("message-app-token", res.data.token);
        setToken(res.data.token);
        setCurrentUser(res.data.user);
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : "Se produjo un error al crear la cuenta";
        throw new Error(message);
      });
  }

  function logout() {
    localStorage.removeItem("message-app-token");
    setCurrentUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("message-app-token");

    if (!token) {
      return setLoading(false);
    }

    axios
      .post("auth/user", { token })
      .then((res) => {
        console.log(res);
        const { username, fullname, email, userId, chats } = res.data.user;
        setToken(token);
        setCurrentUser({ username, fullname, email, userId });
        setChats(chats);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const value = {
    login,
    signup,
    logout,
    token,
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

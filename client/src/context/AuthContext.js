import React, { useContext, useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";

import axios from "../axios-instance";
import { chatsAtom, usersAtom } from "../recoil/atoms";
import { socket } from "../service/socket";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const setChats = useSetRecoilState(chatsAtom);
  const setUsers = useSetRecoilState(usersAtom);

  function login(userData) {
    return axios
      .post("auth/login", { userData })
      .then((res) => {
        const {
          username,
          fullname,
          email,
          userId,
          chats,
          description,
          profileImage,
        } = res.data.user;
        localStorage.setItem("message-app-token", res.data.token);
        setToken(res.data.token);
        setCurrentUser({
          username,
          fullname,
          email,
          userId,
          description,
          profileImage,
        });
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
        const { username, fullname, userId } = res.data.user;
        localStorage.setItem("message-app-token", res.data.token);
        setToken(res.data.token);
        setCurrentUser(res.data.user);
        socket.emit("newUser", { user: { username, fullname, _id: userId } });
      })
      .catch((error) => {
        console.log(error.response);
        const message = error.response
          ? error.response.data.message
          : "Se produjo un error al crear la cuenta";
        throw new Error(message);
      });
  }

  function logout() {
    localStorage.removeItem("message-app-token");
    setCurrentUser(null);
    setChats([]);
    setUsers([]);
  }

  function updateCurrentUser(newUserData) {
    setCurrentUser((prevData) => {
      return {
        ...prevData,
        ...newUserData,
      };
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("message-app-token");

    if (!token) {
      return setLoading(false);
    }

    axios
      .post("auth/user", { token })
      .then((res) => {
        const {
          username,
          fullname,
          email,
          userId,
          description,
          chats,
          profileImage,
        } = res.data.user;
        setToken(token);
        setCurrentUser({
          username,
          fullname,
          email,
          userId,
          description,
          profileImage,
        });
        console.log(chats);
        setChats(chats);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setChats]);

  const value = {
    login,
    signup,
    logout,
    updateCurrentUser,
    token,
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

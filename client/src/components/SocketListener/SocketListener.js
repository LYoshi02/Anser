import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { useAuth } from "../../context/AuthContext";
import { chatsAtom, usersAtom } from "../../recoil/atoms";
import { socket } from "../../service/socket";

const SocketListener = ({ children }) => {
  const { currentUser } = useAuth();
  const setChats = useSetRecoilState(chatsAtom);
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    socket.emit("startConversation", { userId: currentUser.userId });

    socket.on("newChat", ({ chat }) => {
      console.log(chat);
      setChats((prevChats) => [{ ...chat, newMessage: true }, ...prevChats]);
    });

    socket.on("addMessage", ({ chat }) => {
      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id !== chat._id ? c : { ...chat, newMessage: true }
        )
      );
    });

    socket.on("addNewUser", ({ user }) => {
      setUsers((prevUsers) => [{ ...user, newUser: true }, ...prevUsers]);
    });

    return () => socket.removeAllListeners();
  }, [setChats, setUsers, currentUser.userId]);

  return children;
};

export default SocketListener;

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
      setChats((prevChats) => {
        const newChat = { ...chat, newMessage: true };
        const chatChangedIndex = prevChats.findIndex(
          (chat) => chat._id === newChat._id
        );
        let updatedChats = [...prevChats];
        if (chatChangedIndex !== -1) {
          // Replacing an already existing chat
          updatedChats.splice(chatChangedIndex, 1, newChat);
        } else {
          // Adding a new chat to the whole array of chats
          updatedChats.unshift(newChat);
        }

        return updatedChats;
      });
    });

    socket.on("addMessage", ({ chatId, message }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, message],
              newMessage: true,
            };
          }
          return chat;
        })
      );
    });

    socket.on("updateChat", ({ chatId, updatedProperties }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              ...updatedProperties,
            };
          }
          return chat;
        })
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

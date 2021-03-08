import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import BackNav from "../UI/BackNav/BackNav";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { activeUserAtom } from "../../recoil/atoms";
import { currentSingleChatSelector } from "../../recoil/selectors";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message/Message";
import ChatInfo from "./ChatInfo/ChatInfo";
import MessageInput from "./MessageInput/MessageInput";

const SingleChat = (props) => {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [activeUser, setActiveUser] = useRecoilState(activeUserAtom);
  const [currentChat, setCurrentChat] = useRecoilState(
    currentSingleChatSelector
  );

  const userParam = props.match.params.user;
  useEffect(() => {
    axios
      .get(`users/${userParam}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setActiveUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => setActiveUser(null);
  }, [setActiveUser, token, userParam]);

  useEffect(() => {
    if (currentChat && currentChat.newMessage) {
      const updatedChat = { ...currentChat, newMessage: false };
      setCurrentChat(updatedChat);
    }
  }, [currentChat, setCurrentChat]);

  const sendMessage = () => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return;

    let chatData = { receivers: [activeUser._id], text: trimmedText };
    let method = "POST";
    let url = "chats/new";

    if (currentChat) {
      chatData = {
        ...chatData,
        chatId: currentChat._id,
      };
      method = "PUT";
      url = "chats/add-message";
    }

    axios({
      method,
      url,
      data: { chatData },
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        let updatedChat;
        if (currentChat) {
          updatedChat = {
            ...currentChat,
            updatedAt: res.data.updatedAt,
            messages: [...currentChat.messages, res.data.message],
          };
        } else {
          updatedChat = res.data.chat;
        }

        setCurrentChat(updatedChat);
        setText("");
      })
      .catch((error) => {
        setText("");
        console.log(error);
      });
  };

  let messages = null;
  if (currentChat && activeUser) {
    messages = currentChat.messages.map((msg) => (
      <Message key={msg._id} msg={msg} />
    ));
  }

  let chatInfo = null;
  if (activeUser) {
    chatInfo = <ChatInfo user={activeUser} />;
  }

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav>{chatInfo}</BackNav>
      <Flex
        direction="column"
        justify="space-between"
        grow="1"
        overflow="hidden"
      >
        <Box overflow="auto" p="2">
          {messages}
        </Box>
        <MessageInput onSendMessage={sendMessage} />
      </Flex>
    </Flex>
  );
};

export default SingleChat;

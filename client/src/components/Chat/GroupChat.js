import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import BackNav from "../UI/BackNav/BackNav";
import { HiPaperAirplane } from "react-icons/hi";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { activeChatIdAtom } from "../../recoil/atoms";
import { currentGroupChatSelector } from "../../recoil/selectors";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message/Message";
import ChatInfo from "./ChatInfo/ChatInfo";
import GroupMenu from "./GroupMenu/GroupMenu";

const GroupChat = (props) => {
  const { token, currentUser } = useAuth();
  const [text, setText] = useState("");
  const [receivers, setReceivers] = useState(null);
  const [activeChatId, setActiveChatId] = useRecoilState(activeChatIdAtom);
  const [currentChat, setCurrentChat] = useRecoilState(
    currentGroupChatSelector
  );

  const chatIdParam = props.match.params.chatId;
  useEffect(() => {
    setActiveChatId(chatIdParam);
    return () => setActiveChatId(null);
  }, [setActiveChatId, chatIdParam]);

  useEffect(() => {
    if (currentChat) {
      const receivers = currentChat.users.filter(
        (user) => user._id !== currentUser.userId
      );
      setReceivers(receivers);
    }
  }, [currentChat, currentUser.userId]);

  useEffect(() => {
    if (currentChat && currentChat.newMessage) {
      const updatedChat = { ...currentChat, newMessage: false };
      setCurrentChat(updatedChat);
    }
  }, [currentChat, setCurrentChat]);

  const sendMessage = () => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return;

    const receiversIds = receivers.map((r) => r._id);
    const chatData = {
      receivers: receiversIds,
      text: trimmedText,
      chatId: activeChatId,
    };
    axios
      .put(
        "chats/add-message",
        { chatData },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res);
        setCurrentChat(res.data.chat);
        setText("");
      })
      .catch((error) => {
        setText("");
        console.log(error);
      });
  };

  let messages = null,
    chatInfo = null;
  if (currentChat && receivers) {
    messages = currentChat.messages.map((msg) => (
      <Message key={msg._id} msg={msg} />
    ));

    chatInfo = <ChatInfo group={currentChat.group} />;
  }

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav>
        {chatInfo}
        <GroupMenu chatId={activeChatId} />
      </BackNav>
      <Flex
        direction="column"
        p="2"
        justify="space-between"
        grow="1"
        overflow="hidden"
      >
        <Box overflow="auto">{messages}</Box>
        <Flex>
          <Input
            placeholder="Escribe tu mensaje..."
            mr="2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
            required
          />
          <IconButton
            colorScheme="purple"
            icon={<HiPaperAirplane />}
            rounded="full"
            sx={{ transform: "rotateZ(90deg)" }}
            onClick={sendMessage}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GroupChat;

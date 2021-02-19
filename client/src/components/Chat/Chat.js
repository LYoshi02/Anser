import React, { useState, useEffect } from "react";
import { Avatar, Box, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import BackNav from "../UI/BackNav/BackNav";
import { HiPaperAirplane } from "react-icons/hi";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { activeUserAtom } from "../../recoil/atoms";
import { currentChatSelector } from "../../recoil/selectors";
import { useAuth } from "../../context/AuthContext";

const Chat = (props) => {
  const { token, currentUser } = useAuth();
  const [text, setText] = useState("");
  const [activeUser, setActiveUser] = useRecoilState(activeUserAtom);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatSelector);

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

    let chatData = { receiver: activeUser._id, text: trimmedText };
    let method = "POST";
    let url = "chats/new";

    if (currentChat) {
      method = "PUT";
      url = "chats/add-message";
      chatData = {
        ...chatData,
        chatId: currentChat._id,
      };
    }

    axios({
      method,
      url,
      data: { chatData },
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        setCurrentChat(res.data.chat);
        setText("");
      })
      .catch((error) => {
        setText("");
        console.log(error);
      });
  };

  let messages = null;
  if (currentChat) {
    messages = currentChat.messages.map((msg) => {
      const sentByMe = msg.sender === currentUser.userId;
      return (
        <Flex
          key={msg._id}
          my="1"
          direction="column"
          align={sentByMe ? "flex-end" : "flex-start"}
        >
          <Box
            rounded="md"
            px="2"
            py="1"
            bgColor={sentByMe ? "yellow.300" : "gray.200"}
          >
            {msg.text}
          </Box>
        </Flex>
      );
    });
  }

  let userInfo = null;
  if (activeUser) {
    userInfo = (
      <Flex align="center" ml="2" w="full">
        <Box>
          <Avatar
            size="sm"
            name={activeUser.fullname}
            mr="2"
            src={activeUser.profileImage && activeUser.profileImage.url}
          />
        </Box>
        <Box>
          <Text fontWeight="bold" color="white" lineHeight="5">
            {activeUser.fullname}
          </Text>
          {/* <Text color="white" fontSize="sm" lineHeight="5">
            En línea
          </Text> */}
        </Box>
      </Flex>
    );
  }

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav>{userInfo}</BackNav>
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

export default Chat;

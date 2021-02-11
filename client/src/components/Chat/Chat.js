import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
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
        console.log(res);
        setActiveUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => setActiveUser(null);
  }, []);

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
        console.log(res);
      })
      .catch((error) => {
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

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav />
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

{
  /* {messages.map((msg) => (
            <>
              <Flex my="1" direction="column" align="flex-start">
                <Box rounded="md" px="2" py="1" bgColor="gray.200">
                  Un mensaje
                </Box>
              </Flex>

              <Flex my="1" direction="column" align="flex-end">
                <Box rounded="md" px="2" py="1" bgColor="yellow.300">
                  Un mensaje
                </Box>
              </Flex>
            </>
          ))} */
}

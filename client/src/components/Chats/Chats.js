import React from "react";
import { useRecoilValue } from "recoil";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { chatsAtom } from "../../recoil/atoms";
import { useAuth } from "../../context/AuthContext";

const Chats = () => {
  const chats = useRecoilValue(chatsAtom);
  const { currentUser } = useAuth();

  return (
    <Box>
      {chats.map((chat) => {
        const receiver = chat.users.find(
          (user) => user._id !== currentUser.userId
        );
        const lastMessage = chat.messages[chat.messages.length - 1];
        return (
          <Link to={`/chats/${receiver.username}`} key={chat._id}>
            <Flex
              align="center"
              px="2"
              py="4"
              _hover={{ bgColor: "gray.100" }}
              transition="ease-out"
              transitionDuration=".3s"
            >
              <Avatar size="lg" name={receiver.fullname} mr="4"></Avatar>
              <Flex align="center" justify="space-between" w="full">
                <Box>
                  <Text fontWeight="bold" fontSize="xl">
                    {receiver.fullname}
                  </Text>
                  <Text
                    fontSize="md"
                    fontWeight={chat.newMessage ? "bold" : "normal"}
                  >
                    {lastMessage.text}
                  </Text>
                </Box>
                {chat.newMessage && (
                  <Box
                    w="3"
                    h="3"
                    bgColor="purple.700"
                    rounded="full"
                    mr="4"
                  ></Box>
                )}
              </Flex>
            </Flex>
          </Link>
        );
      })}
    </Box>
  );
};

export default Chats;

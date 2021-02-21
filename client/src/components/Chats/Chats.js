import React from "react";
import { HiUserGroup } from "react-icons/hi";
import { useRecoilValue } from "recoil";
import { Avatar, Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { chatsAtom } from "../../recoil/atoms";
import { useAuth } from "../../context/AuthContext";

const Chats = () => {
  const chats = useRecoilValue(chatsAtom);
  const { currentUser } = useAuth();

  return (
    <Box>
      {chats.map((chat) => {
        let avatarProps = null,
          chatName = "",
          chatLink = "";

        if (chat.group) {
          avatarProps = {
            bg: "gray.200",
            icon: <Icon as={HiUserGroup} w={8} h={8} color="gray.500" />,
            src: chat.group.image && chat.group.image.url,
          };
          chatName = chat.group.name;
        } else {
          const receiver = chat.users.find(
            (user) => user._id !== currentUser.userId
          );
          avatarProps = {
            name: receiver.fullname,
            src: receiver.profileImage && receiver.profileImage.url,
          };
          chatName = receiver.fullname;
        }

        const lastMessage = chat.messages[chat.messages.length - 1];
        return (
          <Link to={`/chats/${chat._id}`} key={chat._id}>
            <Flex
              align="center"
              px="2"
              py="4"
              _hover={{ bgColor: "gray.100" }}
              transition="ease-out"
              transitionDuration=".3s"
            >
              <Avatar size="lg" mr="4" {...avatarProps} />
              <Flex align="center" justify="space-between" w="full">
                <Box>
                  <Text fontWeight="bold" fontSize="xl">
                    {chatName}
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

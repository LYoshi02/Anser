import React from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

import { useAuth } from "../../../context/AuthContext";

const Message = ({ msg }) => {
  const { currentUser } = useAuth();

  const sentByMe = msg.sender._id === currentUser.userId;
  let messagePosition = "flex-start";
  if (msg.global) {
    messagePosition = "center";
  } else if (sentByMe) {
    messagePosition = "flex-end";
  }

  let avatarElement = null,
    nameElement;
  if (!sentByMe && !msg.global) {
    avatarElement = (
      <Avatar
        size="sm"
        mr="2"
        name={msg.sender.fullname}
        src={msg.sender.profileImage && msg.sender.profileImage.url}
      />
    );

    nameElement = (
      <Text fontSize="sm" color="gray.500">
        {msg.sender.fullname}
      </Text>
    );
  }

  return (
    <Flex my="2" direction="row" justify={messagePosition} align="center">
      {avatarElement}
      <Box>
        {nameElement}
        <Box
          rounded="md"
          px="3"
          py="1"
          bgColor={sentByMe ? "yellow.200" : "gray.200"}
        >
          <Text>{msg.text}</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Message;

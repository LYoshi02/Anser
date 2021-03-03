import React from "react";
import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

import { useAuth } from "../../../context/AuthContext";

const Message = ({ msg }) => {
  const { currentUser } = useAuth();

  const colorYellow = useColorModeValue("yellow.300", "purple.700");
  const colorGray = useColorModeValue("gray.200", "gray.700");

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

    nameElement = <Text fontSize="sm">{msg.sender.fullname}</Text>;
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
          bgColor={sentByMe ? colorYellow : colorGray}
        >
          <Text>{msg.text}</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Message;

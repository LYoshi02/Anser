import React from "react";
import { Avatar, Box, Flex, Icon, Text } from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

const ChatInfo = ({ user, group }) => {
  let avatarProps = null,
    chatName = null;
  if (group) {
    chatName = group.name;
    avatarProps = {
      bg: "gray.200",
      icon: <Icon as={HiUserGroup} w={5} h={5} color="gray.500" />,
      src: group.image && group.image.url,
    };
  } else {
    chatName = user.fullname;
    avatarProps = {
      name: user.fullname,
      src: user.profileImage && user.profileImage.url,
    };
  }

  return (
    <Flex align="center" ml="2" w="full">
      <Box>
        <Avatar size="sm" mr="2" {...avatarProps} />
      </Box>
      <Box>
        <Text fontWeight="bold" color="white" lineHeight="5">
          {chatName}
        </Text>
      </Box>
    </Flex>
  );
};

export default ChatInfo;

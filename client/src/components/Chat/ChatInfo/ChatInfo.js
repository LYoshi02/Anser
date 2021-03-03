import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

const ChatInfo = ({ user, group }) => {
  const groupBgColor = useColorModeValue("gray.300", "gray.500");
  const groupIconColor = useColorModeValue("white", "gray.200");

  let avatarProps = null,
    chatName = null;
  if (group) {
    chatName = group.name;
    avatarProps = {
      bg: groupBgColor,
      icon: <Icon as={HiUserGroup} w={5} h={5} color={groupIconColor} />,
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

import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const UserPreview = ({
  userData: { username, fullname, newUser, profileImage },
  children,
  clicked,
}) => {
  const userHoverColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      align="center"
      justify="space-between"
      cursor="pointer"
      py="4"
      px="2"
      _hover={{ bgColor: userHoverColor }}
      transition="ease-out"
      transitionDuration=".3s"
      w="full"
      onClick={clicked}
    >
      <Flex>
        <Avatar
          src={profileImage?.url}
          size="lg"
          name={fullname}
          mr="4"
        ></Avatar>
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            {fullname}
          </Text>
          <Text fontSize="md">@{username}</Text>
          {newUser && <Badge colorScheme="purple">New</Badge>}
        </Box>
      </Flex>
      <Box>{children}</Box>
    </Flex>
  );
};

export default UserPreview;

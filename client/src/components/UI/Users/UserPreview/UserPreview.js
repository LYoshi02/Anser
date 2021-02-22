import React from "react";
import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";

const UserPreview = ({
  userData: { username, fullname, newUser, profileImage, _id },
}) => (
  <Flex align="center">
    <Avatar
      src={profileImage && profileImage.url}
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
);

export default UserPreview;

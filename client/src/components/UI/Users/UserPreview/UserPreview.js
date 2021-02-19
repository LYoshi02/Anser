import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Avatar, Badge, Box, Checkbox, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { selectedUsersAtom } from "../../../../recoil/atoms";

const UserPreview = ({
  userData: { username, fullname, newUser, profileImage, _id },
  selection,
  onSelectUser,
}) => {
  const selectedUsers = useRecoilValue(selectedUsersAtom);
  const [userSelected, setUserSelected] = useState(() =>
    selectedUsers.find((u) => u._id === _id)
  );
  const selectUser = (event) => {
    // To prevent duplicated events from the checkbox input and the parent div
    if (event.target.nodeName !== "INPUT") {
      setUserSelected((prev) => !prev);
      onSelectUser({ _id, fullname });
    }
  };

  const user = (
    <Flex
      align="center"
      justify="space-between"
      py="4"
      px="2"
      _hover={{ bgColor: "gray.100" }}
      transition="ease-out"
      transitionDuration=".3s"
    >
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
      {selection && (
        <Box>
          <Checkbox isChecked={userSelected} size="lg" colorScheme="yellow" />
        </Box>
      )}
    </Flex>
  );

  return selection ? (
    <Box cursor="pointer" onClick={selectUser}>
      {user}
    </Box>
  ) : (
    <Link to={`/users/${username}`}>{user}</Link>
  );
};

export default UserPreview;

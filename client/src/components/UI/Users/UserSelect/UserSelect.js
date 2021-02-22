import React, { useState } from "react";
import { Box, Checkbox, Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { selectedUsersAtom } from "../../../../recoil/atoms";
import UserPreview from "../UserPreview/UserPreview";

const UserSelect = ({ onSelectUser, userData }) => {
  const selectedUsers = useRecoilValue(selectedUsersAtom);
  const [userSelected, setUserSelected] = useState(() =>
    selectedUsers.find((u) => u._id === userData._id)
  );

  const selectUser = (event) => {
    // To prevent duplicated events from the checkbox input and the parent div
    if (event.target.nodeName !== "INPUT") {
      setUserSelected((prev) => !prev);
      onSelectUser({ _id: userData._id, fullname: userData.fullname });
    }
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      py="4"
      px="2"
      _hover={{ bgColor: "gray.100" }}
      transition="ease-out"
      transitionDuration=".3s"
      cursor="pointer"
      onClick={selectUser}
    >
      <UserPreview userData={userData} />
      <Checkbox isChecked={userSelected} size="lg" colorScheme="yellow" />
    </Flex>
  );
};

export default UserSelect;

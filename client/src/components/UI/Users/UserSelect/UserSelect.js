import React, { useState } from "react";
import { Checkbox } from "@chakra-ui/react";
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
    <UserPreview userData={userData} clicked={selectUser}>
      <Checkbox isChecked={userSelected} size="lg" colorScheme="yellow" />
    </UserPreview>
  );
};

export default UserSelect;

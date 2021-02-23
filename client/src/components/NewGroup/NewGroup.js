import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSetRecoilState, useRecoilState } from "recoil";
import { Badge, Box, Button, Text, Wrap, WrapItem } from "@chakra-ui/react";

import axios from "../../axios-instance";
import BackNav from "../UI/BackNav/BackNav";
import Users from "../Users/Users";
import NameModal from "./NameModal/NameModal";
import { selectedUsersAtom, chatsAtom } from "../../recoil/atoms";
import { useAuth } from "../../context/AuthContext";

const NewGroup = () => {
  const { token } = useAuth();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useRecoilState(selectedUsersAtom);
  const setChats = useSetRecoilState(chatsAtom);

  useEffect(() => {
    return () => setSelectedUsers([]);
  }, [setSelectedUsers]);

  const selectUser = (user) => {
    setSelectedUsers((prevUsers) => {
      const usersUpdated = [...prevUsers];
      const userFoundIndex = prevUsers.findIndex((u) => u._id === user._id);

      if (userFoundIndex !== -1) {
        usersUpdated.splice(userFoundIndex, 1);
      } else {
        usersUpdated.push(user);
      }

      return usersUpdated;
    });
  };

  const createGroup = (name) => {
    // Verifies that there are no repeated ids in the member's array
    const selectedUsersIds = [
      ...new Set(selectedUsers.map((user) => user._id)),
    ];

    axios
      .post(
        "chats/new",
        { chatData: { groupName: name, receivers: selectedUsersIds } },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res);
        setChats((prevChats) => [res.data.chat, ...prevChats]);
        history.replace(`/chats/group/${res.data.chat._id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  let actionButton = null;
  if (selectedUsers.length > 0) {
    actionButton = (
      <Button
        isFullWidth
        colorScheme="purple"
        position="fixed"
        bottom="0"
        onClick={toggleModal}
      >
        Siguiente
      </Button>
    );
  }

  let wrapItems = (
    <WrapItem opacity="0">
      <Badge>placeholder</Badge>
    </WrapItem>
  );
  if (selectedUsers.length > 0) {
    wrapItems = selectedUsers.map((user) => (
      <WrapItem key={user._id}>
        <Badge key={user._id} variant="subtle" colorScheme="yellow">
          {user.fullname}
        </Badge>
      </WrapItem>
    ));
  }

  let modal = null;
  if (isModalOpen) {
    modal = (
      <NameModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onCreateGroup={createGroup}
      />
    );
  }

  return (
    <Box>
      <BackNav />
      <Box p="2">
        <Text fontSize="lg" mb="1">
          Integrantes {`(${selectedUsers.length})`}:
        </Text>
        <Wrap>{wrapItems}</Wrap>
      </Box>
      <Box pb="10">
        <Users selection onSelectUser={selectUser} />
      </Box>
      {actionButton}
      {modal}
    </Box>
  );
};

export default NewGroup;

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { useAuth } from "../../context/AuthContext";
import { activeChatIdAtom, selectedUsersAtom } from "../../recoil/atoms";
import { currentGroupChatSelector } from "../../recoil/selectors";
import BackNav from "../UI/BackNav/BackNav";
import UserPreview from "../UI/Users/UserPreview/UserPreview";
import MembersModal from "./MembersModal/MembersModal";

const GroupInfo = (props) => {
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const { token } = useAuth();
  const [activeChatId, setActiveChatId] = useRecoilState(activeChatIdAtom);
  const [currentChat, setCurrentChat] = useRecoilState(
    currentGroupChatSelector
  );
  const [selectedMembers, setSelectedMembers] = useRecoilState(
    selectedUsersAtom
  );

  const selectMember = (user) => {
    setSelectedMembers((prevUsers) => {
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

  const addMembersToGroup = () => {
    if (selectedMembers.length === 0) return;

    const selectedMembersIds = [
      ...new Set(selectedMembers.map((user) => user._id)),
    ];

    axios
      .post(
        "group/add-members",
        {
          chatId: activeChatId,
          newMembers: selectedMembersIds,
        },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res);
        setCurrentChat(res.data.chat);
        setMembersModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setMembersModalOpen(false);
      });
  };

  const chatIdParam = props.match.params.chatId;
  useEffect(() => {
    setActiveChatId(chatIdParam);
    return () => setActiveChatId(null);
  }, [setActiveChatId, chatIdParam]);

  const toggleModal = () => {
    setSelectedMembers([]);
    setMembersModalOpen((prevState) => !prevState);
  };

  let groupMembers = null;
  if (currentChat) {
    groupMembers = currentChat.users.map((user) => (
      <Flex
        key={user._id}
        py="4"
        px="2"
        _hover={{ bgColor: "gray.100" }}
        transition="ease-out"
        transitionDuration=".3s"
        justify="space-between"
        align="center"
      >
        <UserPreview userData={user} />
        {user._id === currentChat.group.creator && (
          <Badge colorScheme="purple" variant="subtle">
            Admin
          </Badge>
        )}
      </Flex>
    ));
  }

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav />
      <Container my="4">
        <Box>
          <Text>Nombre del grupo:</Text>
          <Editable defaultValue="name">
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Box>
        <Divider my="2" />
        <Box>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="lg">
              Miembros
            </Text>
            <Button colorScheme="purple" variant="ghost" onClick={toggleModal}>
              Añadir Miembros
            </Button>
          </Flex>
          <Box mt="2">{groupMembers}</Box>
        </Box>
      </Container>
      <MembersModal
        isOpen={membersModalOpen}
        onClose={toggleModal}
        groupUsers={currentChat && currentChat.users}
        onSelectMember={selectMember}
        selectedMembers={selectedMembers}
        onAddMembers={addMembersToGroup}
      />
    </Flex>
  );
};

export default GroupInfo;

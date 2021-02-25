import {
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
import Member from "./Member/Member";
import MembersModal from "./MembersModal/MembersModal";

const GroupInfo = (props) => {
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { token, currentUser } = useAuth();
  const [activeChatId, setActiveChatId] = useRecoilState(activeChatIdAtom);
  const [currentChat, setCurrentChat] = useRecoilState(
    currentGroupChatSelector
  );
  const [selectedMembers, setSelectedMembers] = useRecoilState(
    selectedUsersAtom
  );

  const chatIdParam = props.match.params.chatId;
  useEffect(() => {
    setActiveChatId(chatIdParam);
    return () => setActiveChatId(null);
  }, [setActiveChatId, chatIdParam]);

  useEffect(() => {
    if (currentChat) {
      setIsAdmin(
        currentChat.group.admins.some((admin) => admin === currentUser.userId)
      );
    }
  }, [currentChat, currentUser.userId]);

  const groupAction = (actionName, userChangedId) => {
    if (!activeChatId || !actionName || !userChangedId) return;

    let url = `group/${activeChatId}`;
    if (actionName === "ADD_ADMIN") {
      url += "/add-admin";
    } else if (actionName === "REMOVE_ADMIN") {
      url += "/remove-admin";
    } else if (actionName === "REMOVE_MEMBER") {
      url += "/remove-member";
    }

    axios
      .post(
        url,
        { userChangedId },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        updatedCurrentChat(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addMembersToGroup = () => {
    if (selectedMembers.length === 0) return;

    const selectedMembersIds = [
      ...new Set(selectedMembers.map((user) => user._id)),
    ];

    axios
      .post(
        `group/${activeChatId}/add-members`,
        {
          newMembers: selectedMembersIds,
        },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        updatedCurrentChat(res.data);
        setMembersModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setMembersModalOpen(false);
      });
  };

  const updatedCurrentChat = (updatedProperties) => {
    const currentChatUpdated = { ...currentChat, ...updatedProperties };
    setCurrentChat(currentChatUpdated);
  };

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

  const toggleModal = () => {
    setSelectedMembers([]);
    setMembersModalOpen((prevState) => !prevState);
  };

  let groupMembers = null;
  if (currentChat) {
    groupMembers = currentChat.users.map((user) => (
      <Member
        key={user._id}
        user={user}
        isAdmin={isAdmin}
        admins={currentChat.group.admins}
        onGroupAction={(action) => groupAction(action, user._id)}
      />
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
            {isAdmin && (
              <Button
                colorScheme="purple"
                variant="ghost"
                onClick={toggleModal}
              >
                Añadir Miembros
              </Button>
            )}
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

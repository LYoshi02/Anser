import { Flex, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { useAuth } from "../../context/AuthContext";
import { activeChatIdAtom, selectedUsersAtom } from "../../recoil/atoms";
import { currentGroupChatSelector } from "../../recoil/selectors";
import BackNav from "../UI/BackNav/BackNav";
import Info from "./Info/Info";
import ImageModal from "./ImageModal/ImageModal";
import MembersModal from "./MembersModal/MembersModal";

const GroupInfo = (props) => {
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const { token, currentUser } = useAuth();
  const [activeChatId, setActiveChatId] = useRecoilState(activeChatIdAtom);
  const [currentChat, setCurrentChat] = useRecoilState(
    currentGroupChatSelector
  );
  const [selectedMembers, setSelectedMembers] = useRecoilState(
    selectedUsersAtom
  );
  const toast = useToast();

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

  const changeMembers = (actionName, userChangedId) => {
    if (!activeChatId || !actionName || !userChangedId) return;

    let url = `group/${activeChatId}`;
    if (actionName === "ADD_ADMIN") {
      url += "/add-admin";
    } else if (actionName === "REMOVE_ADMIN") {
      url += "/remove-admin";
    } else if (actionName === "REMOVE_MEMBER") {
      url += "/remove-member";
    } else {
      return;
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
        updateCurrentChat(res.data);
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : error.message;
        showToastError(message);
      });
  };

  const addMembersToGroup = () => {
    if (selectedMembers.length === 0) return;

    const selectedMembersIds = [
      ...new Set(selectedMembers.map((user) => user._id)),
    ];

    setReqLoading(true);
    axios
      .post(
        `group/${activeChatId}/add-members`,
        { newMembers: selectedMembersIds },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        updateCurrentChat(res.data);
        setMembersModalOpen(false);
        setReqLoading(false);
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : error.message;
        setMembersModalOpen(false);
        setReqLoading(false);
        showToastError(message);
      });
  };

  const changeGroupName = (newName) => {
    axios
      .post(
        `group/${activeChatId}/name`,
        { name: newName },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res);
        updateCurrentChat(res.data);
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : error.message;
        showToastError(message);
      });
  };

  const showToastError = (message) => {
    toast({
      title: "Error!",
      description: message,
      status: "error",
      isClosable: true,
    });
  };

  const updateCurrentChat = (updatedProperties) => {
    const updatedMessages = [...currentChat.messages];
    if (updatedProperties.messages) {
      updatedMessages.push(...updatedProperties.messages);
    }
    const currentChatUpdated = {
      ...currentChat,
      ...updatedProperties,
      messages: updatedMessages,
    };
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

  const toggleMembersModal = () => {
    setSelectedMembers([]);
    setMembersModalOpen((prevState) => !prevState);
  };

  const toggleImageModal = () => {
    setImageModalOpen((prevState) => !prevState);
  };

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav />
      <Info
        isAdmin={isAdmin}
        currentChat={currentChat}
        onChangeMembers={changeMembers}
        onToggleMembersModal={toggleMembersModal}
        onToggleImageModal={toggleImageModal}
        onChangeGroupName={changeGroupName}
      />
      <MembersModal
        isOpen={membersModalOpen}
        onClose={toggleMembersModal}
        groupUsers={currentChat && currentChat.users}
        onSelectMember={selectMember}
        selectedMembers={selectedMembers}
        onAddMembers={addMembersToGroup}
        reqLoading={reqLoading}
      />
      <ImageModal
        isOpen={imageModalOpen}
        onCloseModal={toggleImageModal}
        onUpdateChat={updateCurrentChat}
        currentChat={currentChat}
      />
    </Flex>
  );
};

export default GroupInfo;

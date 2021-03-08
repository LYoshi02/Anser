import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { activeChatIdAtom } from "../../recoil/atoms";
import { currentGroupChatSelector } from "../../recoil/selectors";
import { useAuth } from "../../context/AuthContext";
import BackNav from "../UI/BackNav/BackNav";
import Message from "./Message/Message";
import ChatInfo from "./ChatInfo/ChatInfo";
import GroupMenu from "./GroupMenu/GroupMenu";
import MessageInput from "./MessageInput/MessageInput";
import { showErrorMessageToast } from "../../util/helpers";

const GroupChat = (props) => {
  const { token, currentUser } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [receivers, setReceivers] = useState(null);
  const [activeChatId, setActiveChatId] = useRecoilState(activeChatIdAtom);
  const [currentChat, setCurrentChat] = useRecoilState(
    currentGroupChatSelector
  );

  const chatIdParam = props.match.params.chatId;
  useEffect(() => {
    setActiveChatId(chatIdParam);
    return () => setActiveChatId(null);
  }, [setActiveChatId, chatIdParam]);

  useEffect(() => {
    if (currentChat) {
      setIsMember(currentChat.users.some((u) => u._id === currentUser.userId));
    }
  }, [currentChat, currentUser.userId]);

  useEffect(() => {
    if (currentChat) {
      const receivers = currentChat.users.filter(
        (user) => user._id !== currentUser.userId
      );
      setReceivers(receivers);
    }
  }, [currentChat, currentUser.userId]);

  useEffect(() => {
    if (currentChat && currentChat.newMessage) {
      const updatedChat = { ...currentChat, newMessage: false };
      setCurrentChat(updatedChat);
    }
  }, [currentChat, setCurrentChat]);

  const sendMessage = (message) => {
    const trimmedText = message.trim();
    if (trimmedText.length === 0) return;

    const receiversIds = receivers.map((r) => r._id);
    const chatData = {
      receivers: receiversIds,
      text: trimmedText,
      chatId: activeChatId,
    };
    axios
      .put(
        "chats/add-message",
        { chatData },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res);
        const updatedChat = {
          ...currentChat,
          updatedAt: res.data.updatedAt,
          messages: [...currentChat.messages, res.data.message],
        };
        setCurrentChat(updatedChat);
      })
      .catch((error) => {
        showErrorMessageToast(error);
      });
  };

  const leaveGroup = () => {
    axios
      .post(
        `group/${activeChatId}/leave`,
        {},
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        const updatedMessages = [...currentChat.messages];
        if (res.data.messages) {
          updatedMessages.push(...res.data.messages);
        }
        const currentChatUpdated = {
          ...currentChat,
          ...res.data,
          messages: updatedMessages,
        };
        setCurrentChat(currentChatUpdated);
      })
      .catch((error) => {
        showErrorMessageToast(error);
      });
  };

  let messages = null,
    chatInfo = null;
  if (currentChat && receivers) {
    messages = currentChat.messages.map((msg) => (
      <Message key={msg._id} msg={msg} />
    ));

    chatInfo = <ChatInfo group={currentChat.group} />;
  }

  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav>
        {chatInfo}
        {isMember && (
          <GroupMenu chatId={activeChatId} onLeaveGroup={leaveGroup} />
        )}
      </BackNav>
      <Flex
        direction="column"
        justify="space-between"
        grow="1"
        overflow="hidden"
      >
        <Box overflow="auto" p="2">
          {messages}
        </Box>
        <MessageInput onSendMessage={sendMessage} isMember={isMember} />
      </Flex>
    </Flex>
  );
};

export default GroupChat;

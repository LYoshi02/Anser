import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import { HiUserGroup } from "react-icons/hi";

import Member from "../Member/Member";

const Info = ({
  isAdmin,
  currentChat,
  onChangeMembers,
  onToggleMembersModal,
  onToggleImageModal,
}) => {
  let groupMembers = null;
  if (currentChat) {
    groupMembers = currentChat.users.map((user) => (
      <Member
        key={user._id}
        user={user}
        isAdmin={isAdmin}
        admins={currentChat.group.admins}
        onGroupAction={(action) => onChangeMembers(action, user._id)}
      />
    ));
  }

  return (
    <Container my="4">
      <Flex direction="column">
        <Avatar
          size="sm"
          bg="gray.200"
          icon={<Icon as={HiUserGroup} w={20} h={20} color="gray.500" />}
          src={
            currentChat &&
            currentChat.group.image &&
            currentChat.group.image.url
          }
          alignSelf="center"
          mb="2"
          h="36"
          w="36"
          cursor="pointer"
          onClick={onToggleImageModal}
        />
        <Text>Nombre del grupo:</Text>
        <Editable defaultValue="name">
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
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
              onClick={onToggleMembersModal}
            >
              Añadir Miembros
            </Button>
          )}
        </Flex>
        <Box mt="2">{groupMembers}</Box>
      </Box>
    </Container>
  );
};

export default Info;

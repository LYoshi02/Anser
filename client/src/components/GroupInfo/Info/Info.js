import React, { useState, useEffect } from "react";
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
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiUserGroup, HiPencilAlt, HiCheck } from "react-icons/hi";

import Member from "../Member/Member";

const Info = ({
  isAdmin,
  currentChat,
  onChangeMembers,
  onToggleMembersModal,
  onToggleImageModal,
  onChangeGroupName,
}) => {
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    setGroupName(currentChat?.group.name);
  }, [currentChat]);

  const changeName = () => {
    const currentName = currentChat?.group.name;
    if (groupName.trim().length < 3 || groupName === currentName) {
      return setGroupName(currentName);
    }

    onChangeGroupName(groupName);
  };

  function EditableControls({ isEditing, onSubmit, onEdit }) {
    return isEditing ? (
      <IconButton
        icon={<Icon as={HiCheck} w={4} h={4} />}
        onClick={onSubmit}
        ml="2"
      />
    ) : (
      <IconButton
        icon={<Icon as={HiPencilAlt} w={4} h={4} />}
        onClick={onEdit}
        ml="2"
      />
    );
  }

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

  const groupBgColor = useColorModeValue("gray.300", "gray.500");
  const groupIconColor = useColorModeValue("white", "gray.200");

  return (
    <Container my="4">
      <Flex direction="column">
        <Avatar
          size="sm"
          bg={groupBgColor}
          icon={<Icon as={HiUserGroup} w={20} h={20} color={groupIconColor} />}
          src={currentChat?.group?.image?.url}
          alignSelf="center"
          mb="2"
          h="36"
          w="36"
          cursor="pointer"
          onClick={onToggleImageModal}
        />
        <Box mt="4">
          <Text mb="1" fontWeight="bold" fontSize="lg">
            Nombre del grupo
          </Text>
          <Editable
            value={groupName}
            onChange={(value) => setGroupName(value)}
            isPreviewFocusable={false}
            submitOnBlur={false}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onSubmit={changeName}
          >
            {(props) => (
              <>
                <EditablePreview />
                <EditableInput />
                <EditableControls {...props} />
              </>
            )}
          </Editable>
        </Box>
      </Flex>
      <Divider my="4" />
      <Box>
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="lg">
            Miembros {`(${groupMembers?.length || 0})`}
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
        <Box my="2">{groupMembers}</Box>
      </Box>
    </Container>
  );
};

export default Info;

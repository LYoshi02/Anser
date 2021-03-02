import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Users from "../../Users/Users";

const MembersModal = ({
  isOpen,
  onClose,
  groupUsers,
  onSelectMember,
  selectedMembers,
  onAddMembers,
  reqLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent h="80%">
        <ModalHeader>Añadir Nuevos Miembros</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto">
          <Users
            selection
            selectedUsers={groupUsers}
            onSelectUser={onSelectMember}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            isDisabled={selectedMembers.length === 0}
            isLoading={reqLoading}
            onClick={onAddMembers}
          >
            Añadir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MembersModal;

import React, { useRef } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const NameModal = ({ isOpen, onClose }) => {
  const initialRef = useRef();

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dale un nombre a tu grupo</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input ref={initialRef} placeholder="Nombre" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="purple">Crear Grupo</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NameModal;

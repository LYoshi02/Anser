import React, { useRef } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
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
import { useFormik } from "formik";
import * as Yup from "yup";

const NameModal = ({ isOpen, onClose, onCreateGroup }) => {
  const initialRef = useRef();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres"),
    }),
    onSubmit: ({ name }) => {
      onCreateGroup(name);
    },
  });

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
        <form onSubmit={formik.handleSubmit}>
          <ModalBody pb={6}>
            <FormControl id="name" isInvalid={formik.errors.name}>
              <FormLabel>Nombre</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Nombre"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" type="submit">
              Crear Grupo
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NameModal;

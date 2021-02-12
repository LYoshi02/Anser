import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "../../axios-instance";
import BackNav from "../UI/BackNav/BackNav";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { currentUser, token, updateCurrentUser } = useAuth();
  const toast = useToast();
  const [isFormValid, setIsFormValid] = useState(false);
  const formik = useFormik({
    initialValues: {
      fullname: currentUser.fullname,
      description: currentUser.description,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .trim()
        .required("El nombre es obligatorio")
        .max(50, "El nombre puede tener hasta 50 caracteres"),
      description: Yup.string().max(
        100,
        "La descripición puede tener hasta 100 caracteres"
      ),
    }),
    onSubmit: (values) => {
      axios
        .post(`users/${currentUser.username}`, values, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          updateCurrentUser(res.data.user);
          toast({
            title: "Perfil Actualizado",
            description: "Tu perfil se actualizó correctamente",
            status: "success",
            isClosable: true,
          });
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Error",
            description: "Se produjo un error al actualizar tu perfil",
            status: "error",
            isClosable: true,
          });
        });
    },
  });

  useEffect(() => {
    const trimmedName = formik.values.fullname.trim();
    const trimmedDescription = formik.values.description.trim();

    setIsFormValid(false);
    if (
      trimmedName !== currentUser.fullname ||
      trimmedDescription !== currentUser.description
    ) {
      setIsFormValid(true);
    }
  }, [
    formik.values.fullname,
    formik.values.description,
    currentUser.fullname,
    currentUser.description,
  ]);

  return (
    <>
      <BackNav />
      <Container mt="8">
        <Center flexDir="column">
          <Avatar size="2xl" name={currentUser.fullname}></Avatar>
          <Text fontSize="3xl" mt="2" fontWeight="bold">
            @{currentUser.username}
          </Text>
        </Center>
        <form onSubmit={formik.handleSubmit}>
          <Stack mt="8" spacing="4">
            <FormControl
              id="fullname"
              isInvalid={formik.touched.fullname && formik.errors.fullname}
            >
              <FormLabel>Nombre Completo:</FormLabel>
              <Input
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.fullname}</FormErrorMessage>
            </FormControl>

            <FormControl
              id="description"
              isInvalid={
                formik.touched.description && formik.errors.description
              }
            >
              <FormLabel>Descripción:</FormLabel>
              <Textarea
                mt="1"
                placeholder="Tu descripción..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="yellow"
              isDisabled={!isFormValid}
            >
              Guardar
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default Profile;

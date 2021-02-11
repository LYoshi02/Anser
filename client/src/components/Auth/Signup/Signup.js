import React, { useState } from "react";
import {
  Stack,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Button,
  Box,
  Icon,
  Container,
  Text,
  Link,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { HiChevronLeft } from "react-icons/hi";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAuth } from "../../../context/AuthContext";

const Signup = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const { signup } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      fullname: Yup.string()
        .trim()
        .required("El nombre completo es obligatorio"),
      username: Yup.string()
        .trim()
        .required("El nombre de usuario es obligatorio"),
      password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values) => {
      setReqLoading(true);
      try {
        await signup(values);
        setReqLoading(false);
      } catch (error) {
        setReqLoading(false);
        toast({
          title: "Error!",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  return (
    <Flex minH="100vh" direction="column">
      <Flex h="12" bg="purple.800" align="center">
        <Icon
          as={HiChevronLeft}
          w="10"
          h="10"
          color="white"
          onClick={() => history.push("/")}
          cursor="pointer"
        />
      </Flex>
      <Flex grow="1" py="4" px="2" bg="gray.100">
        <Container
          py="6"
          px="4"
          boxShadow="lg"
          rounded="md"
          bg="white"
          alignSelf="center"
        >
          <Heading as="h2" size="xl" mb="4">
            Registrarse
          </Heading>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="3">
              <FormControl
                id="email"
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <FormLabel>Correo</FormLabel>
                <Input
                  type="email"
                  placeholder="usuario@correo.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl
                id="fullname"
                isInvalid={formik.touched.fullname && formik.errors.fullname}
              >
                <FormLabel>Nombre Completo</FormLabel>
                <Input
                  type="text"
                  placeholder="Tu Nombre"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.fullname}</FormErrorMessage>
              </FormControl>

              <FormControl
                id="username"
                isInvalid={formik.touched.username && formik.errors.username}
              >
                <FormLabel>Nombre de Usuario</FormLabel>
                <Input
                  type="text"
                  placeholder="tunombredeusuario"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl
                id="password"
                isInvalid={formik.touched.password && formik.errors.password}
              >
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
            </Stack>
            <Box mt="10">
              <Text fontSize="sm" color="gray.700" textAlign="center" mb="3">
                ¿Ya tenés tu cuenta?{" "}
                <Link
                  as={RouterLink}
                  to="/login"
                  color="yellow.600"
                  fontWeight="bold"
                >
                  Ingresá acá!
                </Link>
              </Text>
              <Button
                variant="solid"
                colorScheme="purple"
                type="submit"
                isFullWidth
                isLoading={reqLoading}
              >
                Crear Cuenta
              </Button>
            </Box>
          </form>
        </Container>
      </Flex>
    </Flex>
  );
};

export default Signup;

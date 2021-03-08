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
  Container,
  Text,
  Link,
  FormErrorMessage,
  useToast,
  InputRightElement,
  InputGroup,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAuth } from "../../../context/AuthContext";
import BackNav from "../../UI/BackNav/BackNav";
import ThemeIcon from "../../UI/ThemeIcon/ThemeIcon";

const Signup = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        .required("El nombre completo es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(30, "El nombre debe tener hasta 30 caracteres"),
      username: Yup.string()
        .trim()
        .matches(
          /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim,
          "El nombre de usuario no es válido"
        )
        .required("El nombre de usuario es obligatorio"),
      password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values) => {
      setReqLoading(true);
      try {
        await signup(values);
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

  const flexBgColor = useColorModeValue("gray.100", "");
  const containerBgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex minH="100vh" direction="column">
      <BackNav isBackRequired>
        <Flex
          w="full"
          justify="flex-end"
          mr="2"
          cursor="pointer"
          color="gray.100"
        >
          <ThemeIcon />
        </Flex>
      </BackNav>
      <Flex grow="1" py="4" px="2" bg={flexBgColor}>
        <Container
          py="6"
          px="4"
          boxShadow="lg"
          rounded="md"
          alignSelf="center"
          bg={containerBgColor}
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
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <InputRightElement>
                    <IconButton
                      colorScheme="gray"
                      icon={showPassword ? <HiEye /> : <HiEyeOff />}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
            </Stack>
            <Box mt="10">
              <Text fontSize="sm" textAlign="center" mb="3">
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

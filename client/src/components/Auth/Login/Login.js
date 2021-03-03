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
  InputGroup,
  InputRightElement,
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

const Login = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values) => {
      setReqLoading(true);
      try {
        await login(values);
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
      <BackNav>
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
          bg={containerBgColor}
          boxShadow="lg"
          rounded="md"
          alignSelf="center"
        >
          <Heading as="h2" size="xl" mb="4">
            Iniciar Sesión
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
                ¿No tenés una cuenta?{" "}
                <Link
                  as={RouterLink}
                  to="/signup"
                  color="yellow.600"
                  fontWeight="bold"
                >
                  Registrate Ahora!
                </Link>
              </Text>
              <Button
                variant="solid"
                colorScheme="purple"
                type="submit"
                isFullWidth
                isLoading={reqLoading}
              >
                Ingresar
              </Button>
            </Box>
          </form>
        </Container>
      </Flex>
    </Flex>
  );
};

export default Login;

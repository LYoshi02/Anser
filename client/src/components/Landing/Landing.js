import React from "react";
import { Link } from "react-router-dom";
import { DiGithubBadge } from "react-icons/di";
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  useColorModeValue,
  Link as ChakraLink,
  Image,
} from "@chakra-ui/react";

import logoImg from "../../assets/logo.png";

const Landing = () => {
  const bgColor = useColorModeValue("gray.200", "gray.900");

  return (
    <Flex w="100%" minH="100vh" bg={bgColor} direction="column">
      <Flex p="2" justify="flex-end" align="center">
        <ChakraLink href="https://github.com/LYoshi02" isExternal>
          <Icon as={DiGithubBadge} h="12" w="12" />
        </ChakraLink>
      </Flex>
      <Stack
        spacing="6"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow="1"
      >
        <Box height="20rem">
          <Image src={logoImg} alt="Anser Logo" boxSize="20rem" />
        </Box>
        <Stack
          spacing="2"
          w={{ base: "90%", md: "80%", lg: "70%" }}
          textAlign="center"
        >
          <Link to="/login">
            <Button
              w={{ base: "100%", md: "15rem" }}
              variant="solid"
              colorScheme="yellow"
            >
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              w={{ base: "100%", md: "15rem" }}
              variant="outline"
              colorScheme="yellow"
            >
              Registrarse
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Landing;

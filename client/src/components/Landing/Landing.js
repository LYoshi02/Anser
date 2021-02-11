import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Stack } from "@chakra-ui/react";

const Landing = () => {
  return (
    <Box w="100%" minH="100vh" bgGradient="linear(to-br, #8E2DE2, #4A00E0)">
      <Stack
        minH="100vh"
        spacing="6"
        justify="center"
        align="center"
        direction="column"
      >
        <Box height="10rem" width="80%" bg="white">
          Logo
        </Box>
        <Stack spacing="2" w="80%">
          <Link to="/login">
            <Button isFullWidth variant="solid" colorScheme="yellow">
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/signup">
            <Button isFullWidth variant="outline" colorScheme="yellow">
              Registrarse
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Landing;

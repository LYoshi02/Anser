import React from "react";
import { Box, Flex, Text, Image, useColorModeValue } from "@chakra-ui/react";

import Home from "../../Home/Home";
import welcomeImg from "../../../assets/welcome.png";

const HomeContent = () => {
  const backgroundColor = useColorModeValue("gray.50", "");

  return (
    <Box height="100%">
      <Box
        height="100%"
        d={{ base: "none", lg: "block" }}
        bgColor={backgroundColor}
      >
        <Flex
          flexDirection="column"
          justify="center"
          align="center"
          height="100%"
          textAlign="center"
        >
          <Box width="40" height="40" mb="4">
            <Image src={welcomeImg} boxSize="40" />
          </Box>
          <Text fontSize="4xl">
            Bienvenido a <span style={{ fontWeight: "bold" }}>Anser</span>
          </Text>
          <Text fontSize="lg">
            Puedes ver tus chats y hablar con los usuarios en el menú de la
            izquierda
          </Text>
        </Flex>
      </Box>

      <Box d={{ base: "block", lg: "none" }}>
        <Home />
      </Box>
    </Box>
  );
};

export default HomeContent;

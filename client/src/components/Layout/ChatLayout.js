import React from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouteMatch } from "react-router";

import Home from "../Home/Home";
import HomeContent from "./HomeContent/HomeContent";
import SocketListener from "../SocketListener/SocketListener";

const ChatLayout = ({ children }) => {
  const isHome = useRouteMatch("/").isExact;
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <SocketListener>
      <Flex height="100%" maxH="100%" overflow="hidden">
        <Box
          borderRight={{ base: null, lg: "1px solid" }}
          borderColor={{ base: null, lg: borderColor }}
          overflow="auto"
          flexBasis={{ base: null, lg: "25rem", xl: "30rem" }}
          d={{ base: "none", lg: "block" }}
        >
          <Home />
        </Box>

        <Box flexGrow="1" overflow="auto">
          {isHome ? <HomeContent /> : children}
        </Box>
      </Flex>
    </SocketListener>
  );
};

export default ChatLayout;

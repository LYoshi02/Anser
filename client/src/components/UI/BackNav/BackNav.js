import React from "react";
import { Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { HiChevronLeft } from "react-icons/hi";
import { useHistory } from "react-router-dom";

const BackNav = ({ children }) => {
  const history = useHistory();

  const colorMainNavbar = useColorModeValue("purple.700", "gray.900");

  return (
    <Flex h="14" minH="14" bg={colorMainNavbar} align="center">
      <Icon
        as={HiChevronLeft}
        w="10"
        h="10"
        color="gray.200"
        onClick={() => history.goBack()}
        cursor="pointer"
      />
      {children}
    </Flex>
  );
};

export default BackNav;

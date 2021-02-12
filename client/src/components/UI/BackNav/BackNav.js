import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { HiChevronLeft } from "react-icons/hi";
import { useHistory } from "react-router-dom";

const BackNav = ({ children }) => {
  const history = useHistory();

  return (
    <Flex h="16" minH="16" bg="purple.800" align="center">
      <Icon
        as={HiChevronLeft}
        w="10"
        h="10"
        color="white"
        onClick={() => history.goBack()}
        cursor="pointer"
      />
      {children}
    </Flex>
  );
};

export default BackNav;

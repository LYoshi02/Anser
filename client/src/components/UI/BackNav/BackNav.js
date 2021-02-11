import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { HiChevronLeft } from "react-icons/hi";
import { useHistory } from "react-router-dom";

const BackNav = () => {
  const history = useHistory();

  return (
    <Flex h="12" minH="12" bg="purple.800" align="center">
      <Icon
        as={HiChevronLeft}
        w="10"
        h="10"
        color="white"
        onClick={() => history.goBack()}
        cursor="pointer"
      />
    </Flex>
  );
};

export default BackNav;

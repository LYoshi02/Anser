import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const UsersLoading = () => (
  <Flex mt="4" justify="center" align="center">
    <Spinner color="purple.600" mr="4" />
    <Text>Cargando Usuarios...</Text>
  </Flex>
);

export default UsersLoading;

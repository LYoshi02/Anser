import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./ColorMode";

const Provider = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default Provider;

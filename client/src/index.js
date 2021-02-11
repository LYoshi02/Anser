import React from "react";
import ReactDOM from "react-dom";
import { ColorModeScript } from "@chakra-ui/react";

import App from "./App";
import ChakraProvider from "./theme/ChakraProvider";
import theme from "./theme/ColorMode";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

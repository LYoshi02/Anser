import React from "react";
import ReactDOM from "react-dom";
import { ColorModeScript } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

import App from "./App";
import ChakraProvider from "./theme/ChakraProvider";
import theme from "./theme/ColorMode";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <AuthProvider>
        <ChakraProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </AuthProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);

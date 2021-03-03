import React from "react";
import {
  Flex,
  Heading,
  Icon,
  MenuItem,
  MenuDivider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  HiUserCircle,
  HiLogout,
  HiUserGroup,
  HiSun,
  HiMoon,
} from "react-icons/hi";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import Menu from "../Menu/Menu";

const MainNav = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const colorRed = useColorModeValue("red.700", "red.400");
  const colorMainNavbar = useColorModeValue("purple.700", "");

  return (
    <Flex
      bg={colorMainNavbar}
      p="2"
      justify="space-between"
      align="center"
      h="14"
      minH="14"
    >
      <Heading as="h1" fontSize="lg" color="gray.200">
        Anser
      </Heading>
      <Menu>
        <MenuItem
          icon={<Icon as={HiUserCircle} w="5" h="5" />}
          onClick={() => history.push("/profile")}
        >
          Mi Perfil
        </MenuItem>
        <MenuItem
          icon={<Icon as={HiUserGroup} w="5" h="5" />}
          onClick={() => history.push("/new-group")}
        >
          Nuevo Grupo
        </MenuItem>
        <MenuItem
          icon={
            colorMode === "light" ? (
              <Icon as={HiMoon} w="5" h="5" />
            ) : (
              <Icon as={HiSun} w="5" h="5" />
            )
          }
          onClick={toggleColorMode}
        >
          {colorMode === "light" ? "Tema Oscuro" : "Tema Claro"}
        </MenuItem>
        <MenuDivider />
        <MenuItem
          color={colorRed}
          icon={<Icon as={HiLogout} w="5" h="5" />}
          onClick={logout}
        >
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </Flex>
  );
};

export default MainNav;

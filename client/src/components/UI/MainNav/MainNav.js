import React from "react";
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  HiDotsVertical,
  HiUserCircle,
  HiLogout,
  HiUserGroup,
} from "react-icons/hi";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

const MainNav = () => {
  const history = useHistory();
  const { logout } = useAuth();

  return (
    <Flex
      bgColor="purple.700"
      color="white"
      p="2"
      justify="space-between"
      align="center"
      h="14"
      minH="14"
    >
      <Heading as="h1" fontSize="lg">
        MessageApp
      </Heading>
      <Menu autoSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<Icon as={HiDotsVertical} />}
          bgColor={"purple.800"}
          _hover={{ bgColor: "purple.900" }}
          _active={{ bgColor: "purple.900" }}
        />
        <MenuList color="gray.900" shadow="md">
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
          <MenuDivider />
          <MenuItem
            color="red.700"
            icon={<Icon as={HiLogout} w="5" h="5" />}
            onClick={logout}
          >
            Cerrar Sesión
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default MainNav;

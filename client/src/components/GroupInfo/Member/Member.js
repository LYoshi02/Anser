import React from "react";
import {
  Badge,
  Box,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import UserPreview from "../../UI/Users/UserPreview/UserPreview";
import { HiDotsVertical } from "react-icons/hi";
import { useAuth } from "../../../context/AuthContext";

const Member = ({ user, isAdmin, admins, onGroupAction }) => {
  const { currentUser } = useAuth();

  const isMemberAdmin = admins.some((admin) => admin === user._id);
  const isYourUser = user._id === currentUser.userId;

  let adminMenu = null;
  if (!isYourUser && isAdmin) {
    const adminMenuItem = isMemberAdmin ? (
      <MenuItem onClick={() => onGroupAction("REMOVE_ADMIN")}>
        Eliminar como Administrador
      </MenuItem>
    ) : (
      <MenuItem onClick={() => onGroupAction("ADD_ADMIN")}>
        Hacer Administrador
      </MenuItem>
    );

    adminMenu = (
      <Box ml="2">
        <Menu autoSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<Icon as={HiDotsVertical} color="gray.700" />}
            size="sm"
          />
          <MenuList color="gray.900" shadow="md">
            {adminMenuItem}
            <MenuItem
              color="red.700"
              onClick={() => onGroupAction("REMOVE_MEMBER")}
            >
              Eliminar del Grupo
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  }

  return (
    <Flex
      py="4"
      px="2"
      _hover={{ bgColor: "gray.50" }}
      transition="ease-out"
      transitionDuration=".3s"
      justify="space-between"
      align="center"
    >
      <UserPreview userData={user} />
      <Flex align="center">
        {isMemberAdmin && (
          <Badge colorScheme="purple" variant="subtle">
            Admin
          </Badge>
        )}
        {adminMenu}
      </Flex>
    </Flex>
  );
};

export default Member;

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

const Member = ({
  user,
  isAdmin,
  admins,
  onAddAdmin,
  onRemoveAdmin,
  onRemoveMember,
}) => {
  const { currentUser } = useAuth();

  const isMemberAdmin = admins.some((admin) => admin === user._id);
  const isYourUser = user._id === currentUser.userId;

  let adminMenu = null;
  if (!isYourUser && isAdmin) {
    const adminMenuItem = isMemberAdmin ? (
      <MenuItem onClick={onRemoveAdmin}>Eliminar como Administrador</MenuItem>
    ) : (
      <MenuItem onClick={onAddAdmin}>Hacer Administrador</MenuItem>
    );

    adminMenu = (
      <Box>
        <Menu autoSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<Icon as={HiDotsVertical} color="gray.700" />}
            size="sm"
          />
          <MenuList color="gray.900" shadow="md">
            {adminMenuItem}
            <MenuItem color="red.700" onClick={onRemoveMember}>
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
      _hover={{ bgColor: "gray.100" }}
      transition="ease-out"
      transitionDuration=".3s"
      justify="space-between"
      align="center"
    >
      <UserPreview userData={user} />
      {isMemberAdmin && (
        <Badge colorScheme="purple" variant="subtle">
          Admin
        </Badge>
      )}
      {adminMenu}
    </Flex>
  );
};

export default Member;

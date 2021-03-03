import React from "react";
import { Badge, Box, Flex, MenuItem } from "@chakra-ui/react";

import { useAuth } from "../../../context/AuthContext";
import Menu from "../../UI/Menu/Menu";
import UserPreview from "../../UI/Users/UserPreview/UserPreview";

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
        <Menu menuColor="gray">
          {adminMenuItem}
          <MenuItem onClick={() => onGroupAction("REMOVE_MEMBER")}>
            Eliminar del Grupo
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <UserPreview userData={user}>
      <Flex align="center">
        {isMemberAdmin && (
          <Badge colorScheme="purple" variant="subtle">
            Admin
          </Badge>
        )}
        {adminMenu}
      </Flex>
    </UserPreview>
  );
};

export default Member;

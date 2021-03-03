import React from "react";
import { Box, MenuItem, useColorModeValue } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import Menu from "../../UI/Menu/Menu";

const GroupMenu = ({ chatId, onLeaveGroup }) => {
  const history = useHistory();

  const colorRed = useColorModeValue("red.700", "red.400");

  return (
    <Box mr="2">
      <Menu>
        <MenuItem onClick={() => history.push(`/group/${chatId}`)}>
          Info. del grupo
        </MenuItem>
        <MenuItem onClick={onLeaveGroup} color={colorRed}>
          Abandonar Grupo
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default GroupMenu;

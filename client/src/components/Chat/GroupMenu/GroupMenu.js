import React from "react";
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { useHistory } from "react-router-dom";

const GroupMenu = ({ chatId, onLeaveGroup }) => {
  const history = useHistory();

  return (
    <Box mr="2">
      <Menu autoSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<Icon as={HiDotsVertical} color="gray.100" />}
          bgColor={"purple.800"}
          _hover={{ bgColor: "purple.900" }}
          _active={{ bgColor: "purple.900" }}
        />
        <MenuList color="gray.900" shadow="md">
          <MenuItem onClick={() => history.push(`/group/${chatId}`)}>
            Info. del grupo
          </MenuItem>
          <MenuItem onClick={onLeaveGroup} color="red.700">
            Abandonar Grupo
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default GroupMenu;

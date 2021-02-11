import {
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import { HiDotsVertical, HiUserCircle, HiLogout } from "react-icons/hi";
import { useHistory } from "react-router-dom";

import Chats from "../Chats/Chats";
import Users from "../Users/Users";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const history = useHistory();
  const { logout } = useAuth();

  return (
    <div>
      <Flex
        bgColor="purple.700"
        color="white"
        p="2"
        justify="space-between"
        align="center"
      >
        <Heading as="h1" fontSize="lg">
          MessageApp
        </Heading>
        <Menu>
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
              color="red.700"
              icon={<Icon as={HiLogout} w="5" h="5" />}
              onClick={logout}
            >
              Cerrar Sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Tabs isFitted variant="line" colorScheme="yellow">
        <TabList>
          <Tab>Chats</Tab>
          <Tab>Usuarios</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <Chats />
          </TabPanel>
          <TabPanel p="0">
            <Users />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Home;

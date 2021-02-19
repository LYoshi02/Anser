import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import React from "react";

import { useRecoilState } from "recoil";

import Chats from "../Chats/Chats";
import MainNav from "../UI/MainNav/MainNav";
import Users from "../Users/Users";
import { tabIndexAtom } from "../../recoil/atoms";

const Home = () => {
  const [tabIndex, setTabIndex] = useRecoilState(tabIndexAtom);

  return (
    <div>
      <MainNav />
      <Tabs
        variant="line"
        colorScheme="yellow"
        isFitted
        index={tabIndex}
        onChange={(i) => setTabIndex(i)}
      >
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

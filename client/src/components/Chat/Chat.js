import React from "react";
import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import BackNav from "../UI/BackNav/BackNav";
import { HiPaperAirplane } from "react-icons/hi";

const messages = [...Array(20).keys()];

const Chat = () => {
  return (
    <Flex h="full" direction="column" maxH="100%">
      <BackNav />
      <Flex
        direction="column"
        p="2"
        justify="space-between"
        grow="1"
        overflow="hidden"
      >
        <Box overflow="auto">
          {messages.map((msg) => (
            <>
              <Flex my="1" direction="column" align="flex-start">
                <Box rounded="md" px="2" py="1" bgColor="gray.200">
                  Un mensaje
                </Box>
              </Flex>

              <Flex my="1" direction="column" align="flex-end">
                <Box rounded="md" px="2" py="1" bgColor="yellow.300">
                  Un mensaje
                </Box>
              </Flex>
            </>
          ))}
        </Box>
        <Flex>
          <Input placeholder="Escribe tu mensaje..." mr="2" />
          <IconButton
            colorScheme="purple"
            icon={<HiPaperAirplane />}
            rounded="full"
            sx={{ transform: "rotateZ(90deg)" }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Chat;

import React from "react";
import { useRecoilValue } from "recoil";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { chatsAtom } from "../../recoil/atoms";

const Chats = () => {
  const chats = useRecoilValue(chatsAtom);

  return (
    <Box>
      {chats.map((chat) => (
        <Link to={`/chats/${chat._id}`}>
          <Flex
            align="center"
            px="2"
            py="4"
            _hover={{ bgColor: "gray.100" }}
            transition="ease-out"
            transitionDuration=".3s"
          >
            <Avatar size="lg" name="Yoshi Debat" mr="4"></Avatar>
            <Box>
              <Text fontWeight="bold" fontSize="xl">
                Yoshi Debat
              </Text>
              <Text fontSize="md">Hola como andas?</Text>
            </Box>
          </Flex>
        </Link>
      ))}
    </Box>
  );
};

export default Chats;

{
  //! MENSAJE NUEVO EJEMPLO
  /* <Link to={`/chats/yoshidebat`}>
        <Flex
          align="center"
          px="2"
          py="4"
          _hover={{ bgColor: "gray.100" }}
          transition="ease-out"
          transitionDuration=".3s"
        >
          <Avatar size="lg" name="Yoshi Debat" mr="4"></Avatar>
          <Flex align="center" justify="space-between" w="full">
            <Box>
              <Text fontWeight="bold" fontSize="xl">
                Yoshi Debat
              </Text>
              <Text fontSize="md" fontWeight="bold">
                Hola como andas?
              </Text>
            </Box>
            <Box w="3" h="3" bgColor="purple.700" rounded="full" mr="4"></Box>
          </Flex>
        </Flex>
      </Link> */
}

import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiPaperAirplane } from "react-icons/hi";

const MessageInput = ({ onSendMessage, isMember = true }) => {
  const [text, setText] = useState("");

  const sendMessageHandler = () => {
    onSendMessage(text);
    setText("");
  };

  const colorGray = useColorModeValue("gray.300", "gray.700");

  let elementContent = (
    <Flex p="2">
      <Input
        placeholder="Escribe tu mensaje..."
        mr="2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessageHandler() : null)}
        required
      />
      <IconButton
        colorScheme="purple"
        icon={<HiPaperAirplane />}
        rounded="full"
        sx={{ transform: "rotateZ(90deg)" }}
        onClick={sendMessageHandler}
      />
    </Flex>
  );
  if (!isMember) {
    elementContent = (
      <Box textAlign="center" bgColor={colorGray} p="1">
        <Text fontSize="lg">Ya no perteneces a este grupo</Text>
      </Box>
    );
  }

  return elementContent;
};

export default MessageInput;

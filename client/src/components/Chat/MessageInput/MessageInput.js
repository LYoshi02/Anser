import React, { useState } from "react";
import { Box, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { HiPaperAirplane } from "react-icons/hi";

const MessageInput = ({ onSendMessage, isMember }) => {
  const [text, setText] = useState("");

  const sendMessageHandler = () => {
    onSendMessage(text);
    setText("");
  };

  let elementContent = (
    <Flex>
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
      <Box textAlign="center" bgColor="gray.200" py="1">
        <Text fontSize="lg">Ya no perteneces a este grupo</Text>
      </Box>
    );
  }

  return elementContent;
};

export default MessageInput;

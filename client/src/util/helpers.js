import { createStandaloneToast } from "@chakra-ui/react";

export const orderChatsByDate = (chats) => {
  const chatsArray = [...chats];

  return chatsArray.sort((chatA, chatB) => {
    if (chatA.updatedAt < chatB.updatedAt) {
      return 1;
    }

    if (chatA.updatedAt > chatB.updatedAt) {
      return -1;
    }

    return 0;
  });
};

export const showErrorMessageToast = (error) => {
  const toast = createStandaloneToast();
  const message = error.response?.data?.message ?? error.message;

  toast({
    title: "Error!",
    description: message,
    status: "error",
    isClosable: true,
  });
};

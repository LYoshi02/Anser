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

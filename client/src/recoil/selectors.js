import { selector } from "recoil";

import { chatsAtom, activeUserAtom } from "./atoms";

export const currentChatSelector = selector({
  key: "currentChat",
  get: ({ get }) => {
    const activeUser = get(activeUserAtom);
    const chats = get(chatsAtom);

    if (!activeUser || !chats || chats.length === 0) return null;

    const foundConv = chats.find((chat) =>
      chat.users.some((user) => user._id === activeUser._id)
    );
    return foundConv;
  },
  set: ({ get, set }, newChat) => {
    const currentChats = get(chatsAtom);

    const chatChangedIndex = currentChats.findIndex(
      (chat) => chat._id === newChat._id
    );
    let updatedChats = [...currentChats];
    if (chatChangedIndex !== -1) {
      // Replacing an already existing chat
      updatedChats.splice(chatChangedIndex, 1, newChat);
    } else {
      // Adding a new chat to the whole array of chats
      updatedChats.push(newChat);
    }

    set(chatsAtom, updatedChats);
  },
});

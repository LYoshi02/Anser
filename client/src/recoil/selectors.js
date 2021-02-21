import { selector } from "recoil";

import { chatsAtom, activeChatIdAtom } from "./atoms";

export const currentChatSelector = selector({
  key: "currentChat",
  get: ({ get }) => {
    const activeChatId = get(activeChatIdAtom);
    const chats = get(chatsAtom);

    if (!activeChatId || !chats || chats.length === 0) return null;

    console.log(chats);

    const foundConv = chats.find((chat) => chat._id === activeChatId);
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

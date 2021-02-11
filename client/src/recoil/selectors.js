import { selector } from "recoil";

import { chatsAtom, activeUserAtom } from "./atoms";

export const currentChatSelector = selector({
  key: "currentChat",
  get: ({ get }) => {
    const activeUser = get(activeUserAtom);
    const chats = get(chatsAtom);

    if (!activeUser || !chats || chats.length === 0) return null;

    const foundConv = chats.find((chat) =>
      chat.users.some((user) => user === activeUser._id)
    );
    return foundConv;
  },
});

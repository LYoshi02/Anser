import { atom } from "recoil";

export const chatsAtom = atom({
  key: "chats",
  default: [],
});

export const activeUserAtom = atom({
  key: "activeUser",
  default: null,
});

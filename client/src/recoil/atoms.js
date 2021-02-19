import { atom } from "recoil";

export const chatsAtom = atom({
  key: "chats",
  default: [],
});

export const activeUserAtom = atom({
  key: "activeUser",
  default: null,
});

export const usersAtom = atom({
  key: "users",
  default: [],
});

export const tabIndexAtom = atom({
  key: "tab",
  default: 0,
});

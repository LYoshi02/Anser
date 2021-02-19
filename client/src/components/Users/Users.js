import React, { useCallback, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import SearchInput from "./SearchInput/SearchInput";
import UserPreview from "../UI/Users/UserPreview/UserPreview";
import { useAuth } from "../../context/AuthContext";
import { usersAtom } from "../../recoil/atoms";
import UsersLoading from "../UI/Users/UsersLoading/UsersLoading";
import UsersNotFound from "../UI/Users/UsersNotFound/UsersNotFound";

const Users = ({ selection, onSelectUser }) => {
  const { token } = useAuth();
  const [users, setUsers] = useRecoilState(usersAtom);
  const [loadingReq, setLoadingReq] = useState(false);

  const fetchUsers = useCallback(
    (searchQuery = "") => {
      setLoadingReq(true);
      axios
        .get(`users${searchQuery}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsers(res.data.users);
          setLoadingReq(false);
        })
        .catch((error) => {
          setLoadingReq(false);
          console.log(error);
        });
    },
    [setUsers, token]
  );

  let usersElement = <UsersLoading />;
  if (!loadingReq && users.length > 0) {
    usersElement = users.map((user) => (
      <UserPreview
        key={user._id}
        userData={user}
        selection={selection}
        onSelectUser={onSelectUser}
      />
    ));
  } else if (!loadingReq && users.length === 0) {
    usersElement = <UsersNotFound />;
  }

  return (
    <Box>
      <SearchInput onSearchUser={fetchUsers} />
      {usersElement}
    </Box>
  );
};

export default Users;

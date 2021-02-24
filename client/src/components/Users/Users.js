import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import SearchInput from "./SearchInput/SearchInput";
import UserPreview from "../UI/Users/UserPreview/UserPreview";
import { useAuth } from "../../context/AuthContext";
import { usersAtom } from "../../recoil/atoms";
import UsersLoading from "../UI/Users/UsersLoading/UsersLoading";
import UsersNotFound from "../UI/Users/UsersNotFound/UsersNotFound";
import UserSelect from "../UI/Users/UserSelect/UserSelect";

const Users = ({ selection, onSelectUser, selectedUsers }) => {
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
          let filteredUsers = [...res.data.users];
          if (selectedUsers) {
            // To filter users that are already members of a certain group
            filteredUsers = res.data.users.filter(
              (u) => !selectedUsers.some((selected) => selected._id === u._id)
            );
          }
          setUsers(filteredUsers);
          setLoadingReq(false);
        })
        .catch((error) => {
          setLoadingReq(false);
          console.log(error);
        });
    },
    [setUsers, token, selectedUsers]
  );

  let usersElement = <UsersLoading />;
  if (!loadingReq && users.length > 0) {
    usersElement = users.map((user) => {
      let element;
      if (selection) {
        element = (
          <UserSelect
            key={user._id}
            userData={user}
            onSelectUser={onSelectUser}
          />
        );
      } else {
        element = (
          <Link to={`/users/${user.username}`} key={user._id}>
            <Box
              py="4"
              px="2"
              _hover={{ bgColor: "gray.100" }}
              transition="ease-out"
              transitionDuration=".3s"
            >
              <UserPreview userData={user} />
            </Box>
          </Link>
        );
      }

      return element;
    });
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

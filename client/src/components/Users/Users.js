import React, { useCallback, useState } from "react";
import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { useAuth } from "../../context/AuthContext";
import { usersAtom } from "../../recoil/atoms";
import SearchInput from "./SearchInput/SearchInput";

const Users = () => {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useRecoilState(usersAtom);

  const fetchUsers = useCallback(
    (searchQuery = "") => {
      axios
        .get(`users${searchQuery}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [setUsers, token]
  );

  return (
    <Box>
      <SearchInput
        search={search}
        onChangeSearch={(e) => setSearch(e.target.value)}
        onCleanSearch={() => setSearch("")}
        onSearchUser={fetchUsers}
      />
      {users.map(({ username, fullname, _id, newUser, profileImage }) => (
        <Link to={`/users/${username}`} key={_id}>
          <Flex
            align="center"
            py="4"
            px="2"
            _hover={{ bgColor: "gray.100" }}
            transition="ease-out"
            transitionDuration=".3s"
          >
            <Avatar
              src={profileImage && profileImage.url}
              size="lg"
              name={fullname}
              mr="4"
            ></Avatar>
            <Box>
              <Text fontWeight="bold" fontSize="xl">
                {fullname}
              </Text>
              <Text fontSize="md">@{username}</Text>
              {newUser && <Badge colorScheme="purple">New</Badge>}
            </Box>
          </Flex>
        </Link>
      ))}
    </Box>
  );
};

export default Users;

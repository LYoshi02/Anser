import React, { useEffect } from "react";
import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";

import axios from "../../axios-instance";
import { useAuth } from "../../context/AuthContext";
import { usersAtom } from "../../recoil/atoms";

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useRecoilState(usersAtom);

  useEffect(() => {
    if (users.length > 0) return;
    axios
      .get("/users", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setUsers(res.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setUsers, token, users.length]);

  return (
    <Box>
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

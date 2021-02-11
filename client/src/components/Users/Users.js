import React, { useEffect, useState } from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import axios from "../../axios-instance";
import { useAuth } from "../../context/AuthContext";

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/users", {
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
  }, []);

  return (
    <Box>
      {users.map(({ username, fullname, _id }) => (
        <Link to={`/users/${username}`} key={_id}>
          <Flex
            align="center"
            py="4"
            px="2"
            _hover={{ bgColor: "gray.100" }}
            transition="ease-out"
            transitionDuration=".3s"
          >
            <Avatar size="lg" name={fullname} mr="4"></Avatar>
            <Box>
              <Text fontWeight="bold" fontSize="xl">
                {username}
              </Text>
              <Text fontSize="md">{fullname}</Text>
            </Box>
          </Flex>
        </Link>
      ))}
    </Box>
  );
};

export default Users;

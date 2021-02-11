import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";

import axios from "../../axios-instance";
import BackNav from "../UI/BackNav/BackNav";
import { useAuth } from "../../context/AuthContext";

const User = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const userParam = props.match.params.user;
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`users/${userParam}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((error) => {
        const message = error.response
          ? error.response.data.message
          : "Seun error al buscar al usuario";
        setError(message);
        setLoading(false);
      });
  }, [userParam]);

  let userElement = (
    <Flex direction="column" align="center">
      <SkeletonCircle size="32" />
      <Stack spacing="2" mt="2">
        <Skeleton>
          <Text fontSize="3xl" mt="2" fontWeight="bold">
            Your Name
          </Text>
        </Skeleton>
        <Skeleton>
          <Text fontSize="lg">Your description goes here...</Text>
        </Skeleton>
      </Stack>
    </Flex>
  );
  if (!loading && user) {
    userElement = (
      <Flex direction="column" align="center">
        <Avatar size="2xl" name={user.fullname}></Avatar>
        <Box w="full">
          <Stack spacing="2" textAlign="center">
            <Text fontSize="3xl" mt="2" fontWeight="bold">
              {user.fullname}
            </Text>
            <Text fontSize="lg">Your description goes here...</Text>
          </Stack>
          <Link to={`/chats/${user.username}`}>
            <Button colorScheme="purple" isFullWidth mt="4">
              Enviar Mensaje
            </Button>
          </Link>
        </Box>
      </Flex>
    );
  } else if (error) {
    userElement = (
      <Alert status="error" variant="top-accent">
        <AlertIcon />
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    );
  }

  return (
    <>
      <BackNav />
      <Container mt="8">{userElement}</Container>
    </>
  );
};

export default User;

import React from "react";
import {
  Avatar,
  Box,
  Center,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import BackNav from "../UI/BackNav/BackNav";

const Profile = () => {
  const history = useHistory();
  return (
    <>
      <BackNav />
      <Container mt="8">
        <Center flexDir="column">
          <Avatar size="2xl" name="Yoshi Debat"></Avatar>
          <Text fontSize="3xl" mt="2" fontWeight="bold">
            @yoshidebat
          </Text>
        </Center>
        <Stack mt="8" spacing="4">
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Nombre Completo:
            </Text>
            <Editable defaultValue="Yoshi Debat" mt="1">
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              Descripción:
            </Text>
            <Textarea placeholder="Tu descripción..." mt="1" />
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Profile;

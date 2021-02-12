import React, { useState } from "react";
import { Box, Button, Container, Flex } from "@chakra-ui/react";

import BackNav from "../../UI/BackNav/BackNav";
import ImageCropper from "./ImageCropper/ImageCropper";

const ProfileImage = () => {
  const [croppedImage, setCroppedImage] = useState(null);

  const loadImage = (event) => {
    const data = new FormData();
    data.append("profilePic", croppedImage);
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  return (
    <Flex minH="full" direction="column">
      <BackNav />
      <Container flexGrow="1" my="4">
        <ImageCropper
          onCropImage={(img) => {
            setCroppedImage(img);
          }}
        />
        <Box>
          <Button isFullWidth colorScheme="purple" mt="4" onClick={loadImage}>
            Subir Imagen
          </Button>
        </Box>

        <img src={croppedImage} style={{ height: "auto", width: "100%" }} />
      </Container>
    </Flex>
  );
};

export default ProfileImage;

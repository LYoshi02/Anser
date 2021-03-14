import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Flex,
  Image,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

const ImageSelector = ({ onSelectImage, image, onDeleteImage, loading }) => {
  const toast = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    multiple: false,
    onDropAccepted: (acceptedImages) => {
      onSelectImage(URL.createObjectURL(acceptedImages[0]));
    },
    onDropRejected: () => {
      toast({
        title: "Error!",
        description:
          "Se produjo un error al seleccionar tu imagen, intenta de nuevo.",
        status: "error",
        isClosable: true,
      });
    },
  });

  const bgColor = useColorModeValue("gray.200", "gray.900");

  return (
    <Box>
      <Box {...getRootProps()}>
        <Flex
          h="96"
          w="100%"
          align="center"
          justify="center"
          bgColor={!image && bgColor}
        >
          <input {...getInputProps()} name="image" />
          {image ? (
            <Image
              src={image}
              alt="Imagen de Perfil"
              objectFit="cover"
              h="100%"
            />
          ) : (
            "Tu Imagen"
          )}
        </Flex>
        <Button colorScheme="yellow" isFullWidth mt="4" isLoading={loading}>
          Seleccionar Imagen
        </Button>
      </Box>
      {image && (
        <Button
          colorScheme="red"
          variant="outline"
          isFullWidth
          mt="2"
          onClick={onDeleteImage}
          isLoading={loading}
        >
          Eliminar Imagen
        </Button>
      )}
    </Box>
  );
};

export default ImageSelector;

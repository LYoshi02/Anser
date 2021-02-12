import React, { useState } from "react";
import Cropper from "react-easy-crop";
import {
  Box,
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";

import getCroppedImg from "./cropImg";

const ImageCropper = ({ onCropImage }) => {
  const [cropConfig, setCropConfig] = useState({
    image:
      "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=749&q=80",
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1 / 1,
    cropShape: "round",
  });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCropConfig({ ...cropConfig, crop });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onZoomChange = (zoom) => {
    setCropConfig({ ...cropConfig, zoom });
  };

  const finishCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(
        cropConfig.image,
        croppedAreaPixels
      );
      onCropImage(croppedImage);
      // setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Flex bgColor="gray.200" h="96" rounded="sm" position="relative">
        <Cropper
          {...cropConfig}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </Flex>
      <Box mt="4">
        <Text>Zoom:</Text>
        <Slider
          aria-label="slider-zoom"
          value={cropConfig.zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(val) => setCropConfig({ ...cropConfig, zoom: val })}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Button isFullWidth colorScheme="purple" mt="4" onClick={finishCrop}>
        Finalizar Corte
      </Button>
    </>
  );
};

export default ImageCropper;

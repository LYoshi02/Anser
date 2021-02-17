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

const ImageCropper = ({ onUploadImage, image, loading }) => {
  const [cropConfig, setCropConfig] = useState({
    image: image,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1 / 1,
    cropShape: "round",
  });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCropConfig({ ...cropConfig, crop });
  };

  const onZoomChange = (zoom) => {
    setCropConfig({ ...cropConfig, zoom });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const finishCrop = async () => {
    onUploadImage(cropConfig.image, croppedAreaPixels);
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
      <Button
        isFullWidth
        colorScheme="purple"
        mt="4"
        onClick={finishCrop}
        isLoading={loading}
      >
        Finalizar y Subir
      </Button>
    </>
  );
};

export default ImageCropper;

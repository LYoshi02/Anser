import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

import axios from "../../../axios-instance";
import ImageSelector from "../../Profile/ProfileImage/ImageSelector/ImageSelector";
import ImageCropper from "../../Profile/ProfileImage/ImageCropper/ImageCropper";
import getCroppedImg from "../../../util/cropImage";
import { useAuth } from "../../../context/AuthContext";

const ImageModal = ({ isOpen, onCloseModal, onUpdateChat, currentChat }) => {
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setImage(currentChat?.group?.image?.url);
  }, [currentChat, isOpen]);

  const selectNewImage = (img) => {
    setImage(img);
    setIsCropping(true);
  };

  const uploadImage = async (image, croppedArea) => {
    if (!currentChat) return;

    setReqLoading(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedArea);
      const blob = await fetch(croppedImage).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image", blob);

      const res = await axios.post(`group/${currentChat._id}/image`, formData, {
        headers: { authorization: "Bearer " + token },
      });
      onUpdateChat(res.data);
      setReqLoading(false);
      closeModal();
      toast({
        title: "Imagen Subida",
        description: "Tu imagen se subió correctamente.",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      setReqLoading(false);
      closeModal();
      toast({
        title: "Error!",
        description: "Se produjo un error al subir la imagen.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const deleteImage = () => {
    setReqLoading(true);
    axios
      .delete(`group/${currentChat._id}/image`, {
        headers: { authorization: "Bearer " + token },
      })
      .then((res) => {
        onUpdateChat(res.data);
        setReqLoading(false);
        closeModal();
        toast({
          title: "Imagen Eliminada",
          description: "Tu imagen se eliminó correctamente.",
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setReqLoading(false);
        closeModal();
        toast({
          title: "Error!",
          description: "Se produjo un error al eliminar la imagen.",
          status: "error",
          isClosable: true,
        });
      });
  };

  const closeModal = () => {
    setImage(null);
    setIsCropping(false);
    onCloseModal();
  };

  let modalBodyContent = (
    <ImageSelector
      image={image}
      loading={reqLoading}
      onSelectImage={selectNewImage}
      onDeleteImage={deleteImage}
    />
  );
  if (image && isCropping) {
    modalBodyContent = (
      <ImageCropper
        loading={reqLoading}
        onUploadImage={uploadImage}
        image={image}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent h="80%">
        <ModalHeader>Imagen del Grupo</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto" py="4">
          {modalBodyContent}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;

import React, { useState, useEffect } from "react";
import { Container, Flex, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import axios from "../../../axios-instance";
import BackNav from "../../UI/BackNav/BackNav";
import ImageCropper from "./ImageCropper/ImageCropper";
import ImageSelector from "./ImageSelector/ImageSelector";
import { useAuth } from "../../../context/AuthContext";
import getCroppedImg from "../../../util/cropImage";
import { showErrorMessageToast } from "../../../util/helpers";

const ProfileImage = () => {
  const [image, setImage] = useState(null);
  const [reqLoading, setReqLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const { token, updateCurrentUser, currentUser } = useAuth();
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (currentUser.profileImage) {
      setImage(currentUser.profileImage.url);
    }
  }, [currentUser]);

  const selectNewImage = (img) => {
    setImage(img);
    setIsCropping(true);
  };

  const deleteImage = () => {
    setReqLoading(true);
    axios
      .delete("profile/image", {
        headers: { authorization: "Bearer " + token },
      })
      .then((res) => {
        updateCurrentUser({ profileImage: null });
        setImage(null);
        setReqLoading(false);
        toast({
          title: "Imagen Eliminada",
          description: "Tu imagen se eliminó correctamente.",
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        setReqLoading(false);
        showErrorMessageToast(error);
      });
  };

  const uploadImage = async (image, croppedArea) => {
    setReqLoading(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedArea);
      const blob = await fetch(croppedImage).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image", blob);

      const res = await axios.post("profile/image", formData, {
        headers: { authorization: "Bearer " + token },
      });

      console.log(res);
      updateCurrentUser({ profileImage: res.data.profileImage });
      setReqLoading(false);
      toast({
        title: "Imagen Subida",
        description: "Tu imagen se subió correctamente.",
        status: "success",
        isClosable: true,
      });
      history.replace("/profile");
    } catch (error) {
      setReqLoading(false);
      showErrorMessageToast(error);
    }
  };

  let imageComponent = (
    <ImageSelector
      image={image}
      loading={reqLoading}
      onSelectImage={selectNewImage}
      onDeleteImage={deleteImage}
    />
  );
  if (image && isCropping) {
    imageComponent = (
      <ImageCropper
        loading={reqLoading}
        onUploadImage={uploadImage}
        image={image}
      />
    );
  }

  return (
    <Flex minH="full" direction="column">
      <BackNav />
      <Container flexGrow="1" my="4">
        {imageComponent}
      </Container>
    </Flex>
  );
};

export default ProfileImage;

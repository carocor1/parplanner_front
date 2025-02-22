import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

// Define la interfaz para las props
interface BasicAvatarProps {
  onImageSelected: (uri: string) => void;
  reset: boolean;
}

const BasicAvatar: React.FC<BasicAvatarProps> = ({
  onImageSelected,
  reset,
}) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (reset) {
      setImage(null); // Reset the image state
    }
  }, [reset]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      onImageSelected(selectedImageUri); // Pasar la imagen seleccionada al componente padre
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={styles.container}>
        <Avatar
          rounded
          source={image ? { uri: image } : undefined}
          size="xlarge"
          overlayContainerStyle={{ backgroundColor: "#f8f8f8" }}
          icon={{ name: "user", type: "font-awesome", color: "gray" }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BasicAvatar;

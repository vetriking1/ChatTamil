import React, { useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const CheckPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      sendImage(result.assets[0].uri);
    }
  };

  const sendImage = async (uri: string) => {
    let filename = uri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename ?? "");
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("file", {
      uri,
      name: filename ?? "photo.jpg",
      type,
    } as unknown as Blob);

    try {
      const response = await fetch(
        "https://33af-2401-4900-632c-4c45-3487-ed92-6b3-a622.ngrok-free.app/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const json = await response.json();
      setResult(json.response);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <ImageBackground
      source={require("./backround2.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={{ flex: 0.4 }}>
          <Text style={styles.header}>பயிர் ஆரோக்கியம்</Text>
        </View>
        <View style={{ flex: 1.2 }}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button
            color={"green"}
            title="படத்தை தேர்ந்தெடுக்கவும்"
            onPress={pickImage}
          />
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>கணிப்பு:</Text>
              <Text style={styles.result}>{result}</Text>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 90,
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d7d46",
  },
  subHeader: {
    fontSize: 18,
    margin: 10,
    color: "#2d7d46",
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2d7d46",
    borderRadius: 5,
  },
  resultText: {
    fontSize: 20,
    color: "#2d7d46",
  },
  result: {
    fontSize: 18,
    color: "#2d7d46",
  },
});

export default CheckPage;

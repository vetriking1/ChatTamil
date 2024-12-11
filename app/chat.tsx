import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type Message = {
  sender: "user" | "bot";
  text?: string;
  imageUrl?: string;
};

const Chat: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "நான் அக்ரி சேட்பாட் உங்கள் உரையாடலை  தொடங்கலாம்!" },
  ]);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 100000);

  const sendMessage = async () => {
    if (text.trim() === "") return;

    const newMessage: Message = { sender: "user", text };
    setMessages([...messages, newMessage]);

    try {
      const response = await fetch(
        "https://33af-2401-4900-632c-4c45-3487-ed92-6b3-a622.ngrok-free.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        }
      );
      const json = await response.json();
      const botMessage: Message = { sender: "bot", text: json.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    } finally {
      setText("");
    }
  };

  const pickImage = async () => {
    let result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!result.canceled) {
      const newMessage: Message = {
        sender: "user",
        imageUrl: result.assets[0].uri,
      };
      setMessages([...messages, newMessage]);
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
    } as any);

    try {
      const response = await fetch(
        "https://33af-2401-4900-632c-4c45-3487-ed92-6b3-a622.ngrok-free.app/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
          signal: controller.signal,
        }
      );

      const json = await response.json();
      const botMessage: Message = { sender: "bot", text: json.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Error uploading image:", error);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      {item.text && <Text>{item.text}</Text>}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.chatText}>உரையாடல் பகுதி</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="தட்டச்சு செய்யவும்..."
        />

        <Button title="அனுப்பு" onPress={sendMessage} color={"green"} />
        <Button title="படம் அனுப்பு" onPress={pickImage} color={"green"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flex: 0.8,
    padding: 10,
  },
  inputContainer: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightgray",
  },
  chatText: {
    color: "green",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Chat;

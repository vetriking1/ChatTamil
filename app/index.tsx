import React from "react";
import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("./backround.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>அக்ரி உரையாடல்</Text>
        <Text style={styles.title}>வரவேற்கிறது</Text>
        {/* வரவேற்கிறது */}
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              color={"green"}
              title="விவசாயி உரையாடல்"
              onPress={() => router.push("/chat")}
            />
          </View>
          <View style={styles.button}>
            <Button
              color={"green"}
              title="பயிர் ஆரோக்கிய பரிசோதனை"
              onPress={() => router.push("/cropCheck")}
            />
          </View>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#E5CF0A",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    marginVertical: 10,
    paddingBottom: 50,
  },
});

export default HomeScreen;

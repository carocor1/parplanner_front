import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import * as WebBrowser from "expo-web-browser";

const iniciarSesionWithGoogle = async () => {
  try {
    const result = await WebBrowser.openBrowserAsync(
      "http://rested-present-trout.ngrok-free.app/parplanner/auth/google"
    );
    console.log(result);
  } catch (error) {
    console.error("Error al abrir el navegador:", error);
  }
};

const GoogleLogInButton = () => {
  return (
    <View>
      <TouchableOpacity onPress={iniciarSesionWithGoogle} style={styles.button}>
        <Image
          source={require("../assets/images/googleIcon.png")}
          style={styles.logo}
        />
        <Text style={styles.textoBoton}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleLogInButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  logo: {
    width: 25,
    height: 30,
    marginRight: 15,
  },
  textoBoton: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.negro.negroNormal,
  },
});

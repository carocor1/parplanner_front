import { Link } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import DocumentoRectangulo from "../components/DocumentosRectangulo"; // Asegúrate de que la ruta sea correcta
import { getGastosByProgenitor } from "../services/gastoService";
import { Button } from "react-native-elements";

export default function DocumentoScreen() {
  return <Text>Estoy en documentos</Text>;
}

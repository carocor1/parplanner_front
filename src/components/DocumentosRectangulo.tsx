import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";

// Definición del tipo de props
type DocumentoRectanguloProps = {
  titulo: string;
  contenido: string;
  imagen: "vacunas" | "alergias" | "historialclinico" | "documentos";
};

const images = {
  vacunas: require("./../assets/images/vacunas.jpg"),
  alergias: require("./../assets/images/alergias.png"),
  historialclinico: require("./../assets/images/historialclinico.jpg"),
  documentos: require("./../assets/images/documentos.jpg"),
};

// Obtener las dimensiones de la pantalla
const { width } = Dimensions.get("window");

const DocumentoRectangulo: React.FC<DocumentoRectanguloProps> = ({
  titulo,
  contenido,
  imagen,
}) => {
  return (
    <View style={styles.card}>
      <Image source={images[imagen]} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.content}>{contenido}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    height: 150,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    flexDirection: "row",
  },
  image: {
    width: "33%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: "#333",
  },
});

export default DocumentoRectangulo;

import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

type MercadoPagoButtonProps = {
  onPress: () => void;
};

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.botonMercadoPago} onPress={onPress}>
      <Image
        source={require("./../assets/images/mercadopagoimage.png")}
        style={styles.logoMercadoPago}
      />
      <Text style={styles.textoBoton}>Pagar con Mercado Pago</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botonMercadoPago: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#088ce4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  logoMercadoPago: {
    width: 40,
    height: 30,
    marginRight: 7,
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default MercadoPagoButton;

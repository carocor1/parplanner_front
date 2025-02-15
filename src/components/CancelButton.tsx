import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

type CancelButtonProps = {
  texto: string;
  onPress: () => void;
};

const CancelButton: React.FC<CancelButtonProps> = ({ texto, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cancelButton}>
      <Text style={styles.cancelButtonText}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: "white",
    borderColor: Colors.naranja.naranjaNormal,
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "45%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButtonText: {
    color: Colors.naranja.naranjaNormal,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CancelButton;

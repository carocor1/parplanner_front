import { StyleSheet, Text, TouchableOpacity } from "react-native";

type SaveButtonProps = {
  texto: string;
  onPress: () => void;
};

const SaveButton: React.FC<SaveButtonProps> = ({ texto, onPress }) => {
  return (
    <TouchableOpacity style={styles.saveButton} onPress={onPress}>
      <Text style={styles.buttonText}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "#DF732E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginLeft: 10,
    width: "45%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
  },
});

export default SaveButton;

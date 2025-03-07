import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

type InputComponentProps = {
  label: string;
  value: string;
  setFunction: (text: string) => void;
  style?: ViewStyle | TextStyle;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  value,
  setFunction,
  style,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "none",
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setFunction}
        placeholder={label}
        keyboardType={keyboardType}
        style={[styles.input]}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: "7%",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default InputComponent;

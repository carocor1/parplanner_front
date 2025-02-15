import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface CustomTextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  primaryColor: string;
  icon?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  primaryColor,
  icon,
}) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles.textInput}
      theme={{
        colors: {
          primary: primaryColor,
        },
      }}
      right={icon ? <TextInput.Icon icon={icon} /> : null}
      keyboardType={keyboardType}
      outlineStyle={styles.outlineStyle}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
    marginTop: 10,
  },
  outlineStyle: {
    borderWidth: 1.5,
    borderRadius: 10,
  },
});

export default CustomTextInput;

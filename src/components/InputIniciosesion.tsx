import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Icon } from "react-native-elements";

type InputComponentProps = {
  label: string;
  value: string;
  setFunction: (text: string) => void;
  iconName: string;
  iconType: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const InputComponentInicioSesion: React.FC<InputComponentProps> = ({
  label,
  value,
  setFunction,
  iconName,
  iconType,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); //

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.inputGroup}>
      <TextInput
        value={value}
        onChangeText={setFunction}
        placeholder={label}
        style={styles.input}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />

      {secureTextEntry ? (
        <Pressable onPress={togglePasswordVisibility} style={styles.icon}>
          <Icon
            name={isPasswordVisible ? "eye-slash" : "eye"}
            type="font-awesome"
            size={24}
            color="gray"
          />
        </Pressable>
      ) : (
        <Icon
          name={iconName}
          type={iconType}
          size={24}
          color="gray"
          style={styles.icon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 0,
  },
});

export default InputComponentInicioSesion;

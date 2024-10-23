import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';

type InputComponentProps = {
  label: string;
  value: string;
  setFunction: (text: string) => void;
  iconName: string;    // Nombre del icono inicial
  iconType: string;    // Tipo de icono
  secureTextEntry?: boolean; // Indica si es un campo de contraseña
};

const InputComponentInicioSesion: React.FC<InputComponentProps> = ({
  label,
  value,
  setFunction,
  iconName,
  iconType,
  secureTextEntry = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // Estado para alternar visibilidad

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);  // Alterna la visibilidad de la contraseña
  };

  return (
    <View style={styles.inputGroup}>
      {/* Verifica el tipo de icono y maneja la visibilidad */}
      {secureTextEntry ? (
        <Pressable onPress={togglePasswordVisibility} style={styles.icon}>
          <Icon
            name={isPasswordVisible ? 'eye-slash' : 'eye'}  // Alterna entre "ojo" y "ojo tachado"
            type="font-awesome"
            size={24}
            color="gray"
          />
        </Pressable>
      ) : (
        <Icon name={iconName} type={iconType} size={24} color="gray" style={styles.icon} />
      )}

      {/* Input de texto con control de visibilidad */}
      <TextInput
        value={value}
        onChangeText={setFunction}
        placeholder={label}
        style={styles.input}
        secureTextEntry={!isPasswordVisible} // Muestra u oculta la contraseña
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row', // Asegura que los íconos estén alineados en fila
    alignItems: 'center',
    width: '100%',
    marginTop:40,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 15,
    backgroundColor: 'white',
    paddingHorizontal: 10, 
    // Añade padding horizontal para espacio general
  },
  icon: {
    marginHorizontal: 5, // Añade margen horizontal para separar los íconos
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 0, // Elimina el padding izquierdo para que el ícono no esté tan pegado
  },
});

export default InputComponentInicioSesion;

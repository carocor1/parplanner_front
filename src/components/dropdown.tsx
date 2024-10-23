import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

// Definir la interfaz de props
interface DropdownComponentProps {
  title: string; // El título del dropdown
  labels: string[]; // Un array de strings para los labels
  onSelect: (label: string) => void; // Función para manejar la selección
  style?: object;
}

/*PARA USARLO SE TIENE QUE MANDAR COMO PARÁMETROS UN TITLE QUE REPRESENTA LO QUE SE SELECCIONA,
LABELS, QUE SERIA EL ARRAY DE STRINGS DE LO QUE SE VA A SELECCIONAR Y DEVUELVE
UNA FUNCIÓN ONSELECT QUE BÁSICAMENTE TE DEVUELVE EL STRING QUE FUE SELECCIONADO
*/
const DropdownComponent: React.FC<DropdownComponentProps> = ({ title, labels, onSelect, style}) => {
  // Generar los datos automáticamente a partir del array de labels
  const data = labels.map((label, index) => ({
    label: label,
    value: index.toString(), // Usar el índice como valor
  }));

  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'gray' }]} // Cambiar a color deseado en `isFocus` si es necesario
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={title}
        searchPlaceholder="Buscar..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onSelect(item.label); // Enviar la etiqueta seleccionada al componente padre
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: { // Eliminar el padding para que no haya espacio entre el dropdown y otros elementos
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom:15,
    paddingHorizontal: 33
  },
  dropdown: {
    height: 50,
    borderColor: 'gray', // Cambiar el color del borde a gris
    borderWidth: 1,
    borderRadius: 20, // Bordes redondeados en el dropdown
    backgroundColor: '#ffffff',
    padding: 10 // Color de fondo blanco para el dropdown
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'gray', // Color del texto del placeholder
  },
  selectedTextStyle: {
    width:'40%',
    color: 'gray', // Cambiar el color del texto seleccionado a gris
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 15,
    borderRadius: 5,
  },
});
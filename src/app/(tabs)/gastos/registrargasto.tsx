import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import DropdownComponent from '../../../components/dropdown';
import SaveButton from '../../../components/SaveButton';
import CancelButton from '../../../components/CancelButton';
import InputContainer from '../../../components/InputComponent';

const RegistrarGastoScreen = () => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [particion1Seleccionada, setParticion1Seleccionada] = useState('');
  const [particion2Seleccionada, setParticion2Seleccionada] = useState('');
  const [errors, setErrors] = useState('');
  const router = useRouter();

  const categorias = ['Indumentaria', 'Educación', 'Salud', 'Recreación'];
  const numeros = Array.from({ length: 100 }, (_, index) => (index + 1).toString());

  const validateInput = () => {
    setErrors('');
    if (!nombre) {
      setErrors('El nombre es requerido');
      return false;
    }
    if (!monto) {
      setErrors('El monto es requerido');
      return false;
    }
    if (isNaN(parseFloat(monto))) {
      setErrors('El monto debería ser un número');
      return false;
    }
    if (!categoriaSeleccionada) {
      setErrors('No se seleccionó una categoría');
      return false;
    }
    if (!particion1Seleccionada) {
      setErrors('No se indicó la partición');
      return false;
    }
    if (!particion2Seleccionada) {
      setErrors('No se indicó la partición');
      return false;
    }
    return true;
  };

  const crearGasto = () => {
    if (!validateInput()) {
      return;
    }
    console.log('Creando gasto', { nombre, monto, descripcion, categoriaSeleccionada, particion1Seleccionada, particion2Seleccionada });
    setNombre('');
    setMonto('');
    setDescripcion('');
    setCategoriaSeleccionada('');
    setParticion1Seleccionada('');
    setParticion2Seleccionada('');
  };

  const noGuardarGasto = () => {
    router.back();
  };

  const handleParticion1Select = (value: string) => {
    console.log('value', value);
    setParticion1Seleccionada(value);
    console.log((100 - parseInt(value)));
    console.log((100 - parseInt(value)).toString());
    setParticion2Seleccionada((100 - parseInt(value)).toString());
    console.log('particion2', particion2Seleccionada);
  };

  return (
    <View style={styles.container}>
      <InputContainer label="Nombre del gasto" value={nombre} setFunction={setNombre} />

      <Text style={styles.label}>Categoría</Text>
      <View style={{paddingBottom: 15}}>
        <DropdownComponent title="Categoría" labels={categorias} onSelect={setCategoriaSeleccionada} />
      </View>
      <InputContainer label="Descripción" value={descripcion} setFunction={setDescripcion} />

      <View style={styles.inputGroup}>
        <Text style={styles.labelMonto}>Total: $</Text>
        <TextInput
          value={monto}
          onChangeText={setMonto}
          placeholder="Monto"
          style={styles.smallInput}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.grupoParticion}>
      <Text style={styles.particion}>Vos (%): </Text>
      <DropdownComponent
        title="%"
        labels={numeros}
        onSelect={handleParticion1Select}
        style={styles.dropdown} // Aplica el estilo al Dropdown
      />
      <Text style={styles.calculoText}>Mirtha (%): </Text> 
      {particion2Seleccionada ? (
        <Text style={styles.calculoText}>{particion2Seleccionada}%</Text> // Solo aparece el porcentaje si está calculado
      ) : (
        <Text style={styles.calculoText}>0%</Text> // O puedes mostrar "0%" o "N/A" si no hay porcentaje calculado
      )}
      </View>

      <Text style={styles.error}>{errors}</Text>

      <View style={styles.buttonContainer}>
        <CancelButton texto="Cancelar" onPress={noGuardarGasto} />
        <SaveButton texto="Guardar" onPress={crearGasto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  grupoParticion: {
    paddingTop: 10,
    flexDirection: 'row',         // Alinea los elementos en línea
    alignItems: 'center',         // Centra los elementos verticalmente // Espacio uniforme entre los 
    marginBottom: 15,             // Espacio abajo del grupo
  },
  particion: {
    fontSize: 14,                 // Tamaño de fuente del texto
    fontWeight: 'bold', 
    marginLeft: 20          // Fuente en negrita             // Espacio entre el texto y el dropdown
  },
  dropdown: {
    flex: 1,                      // Permite que el dropdown ocupe más espacio
      // Espacio horizontal a los lados
    // Si tienes un tamaño específico en mente: 
    marginLeft:10       // Ancho mínimo para el dropdown
  },
  calculoText: {
    fontSize: 14,                 // Tamaño de fuente del texto de cálculo
    marginRight: 10,               // Espacio a la izquierda del texto de cálculo
  },
  inputGroup: {
    flexDirection: 'row',  // Alinea los elementos en línea
    alignItems: 'center',   
    justifyContent: 'space-between',  // Alinea verticalmente al centro
    marginBottom: 15,       // Mantiene separación con el siguiente componente
  },
  label: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: '10%',
    marginRight: 10,
    
  },
  labelMonto: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold', // Centra el texto horizontalmente
    marginLeft: 110,
  },
  smallInput: {
    width: '30%', // Reduced width
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 100,
    
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistrarGastoScreen;

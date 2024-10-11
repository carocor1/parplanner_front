import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DropdownComponent from '../../../../components/dropdown';
import SaveButton from '../../../../components/SaveButton';
import CancelButton from '../../../../components/CancelButton';
import InputContainer from '../../../../components/InputComponent';
import InputSpinner from "react-native-input-spinner";
import CurrencyInput from 'react-native-currency-input';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { gastos } from '../../../../data/data';

const EditarGastoScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [nombre, setNombre] = useState<string>(''); 
  const [monto, setMonto] = useState<number>(1000); 
  const [descripcion, setDescripcion] = useState<string>(''); 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(''); 
  const [particion1Seleccionada, setParticion1Seleccionada] = useState<number>(50); 
  const [particion2Seleccionada, setParticion2Seleccionada] = useState<number>(50); 
  const [errors, setErrors] = useState<string>(''); 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState<boolean>(false);
  const categorias = ['Indumentaria', 'Educación', 'Salud', 'Recreación'];

  useEffect(() => {
    const fetchGasto = async () => {
      const fetchedGasto = gastos.find(gasto => gasto.id === Number(id));

      if (fetchedGasto) {
        setNombre(fetchedGasto.titulo);
        setMonto(fetchedGasto.monto);
        setDescripcion(fetchedGasto.descripcion);
        setCategoriaSeleccionada(fetchedGasto.categoria.nombre);
        setParticion1Seleccionada(fetchedGasto.particionProgenitorCreador);
        setParticion2Seleccionada(fetchedGasto.particionProgenitorParticipe);
        setSelectedImage(fetchedGasto.comprobanteCompra);
      } else {
        console.error('Gasto no encontrado');
      }
    };

    fetchGasto();
  }, [id]);

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
    if (isNaN(monto)) {
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
    if (!selectedImage) {
      setErrors('Se requiere adjuntar un comprobante de compra');
      return false;
    }
    return true;
  };

  const actualizarGasto = () => {
    if (!validateInput()) {
      return;
    }
    console.log('Actualizando gasto', { 
      nombre, 
      monto, 
      descripcion, 
      categoriaSeleccionada, 
      particion1Seleccionada, 
      particion2Seleccionada, 
      selectedImage,
    });
    
    router.back();
  };

  const noActualizarGasto = () => {
    router.back();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageSuccess(true);
    }
  };

  return (
    <View style={styles.container}>
      <InputContainer label="Nombre del gasto" value={nombre} setFunction={setNombre} />

      <Text style={styles.label}>Categoría</Text>
      <View style={{ paddingBottom: 15 }}>
        <DropdownComponent title={categoriaSeleccionada} labels={categorias} onSelect={setCategoriaSeleccionada} />
      </View>
      <InputContainer label="Descripción" value={descripcion} setFunction={setDescripcion} />

      <Text style={styles.label}>Monto: </Text>
      <CurrencyInput
        value={monto}
        onChangeValue={(value) => setMonto(value ?? 0)}
        prefix="$"
        delimiter=","
        precision={0}
        minValue={0}
        style={styles.currencyInput}
      />


      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <MaterialIcons name="attach-file" size={24} color="white" />
        <Text style={styles.uploadButtonText}>Adjuntar nuevo comprobante de Compra</Text>
      </TouchableOpacity>

      {imageSuccess && <Text style={styles.uploadSuccessText}>¡Comprobante adjuntado con éxito!</Text>}

      <Text style={styles.error}>{errors}</Text>

      <View style={styles.buttonContainer}>
        <CancelButton texto="Cancelar" onPress={noActualizarGasto} />
        <SaveButton texto="Actualizar" onPress={actualizarGasto} />
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
  label: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: '10%',
    marginRight: 10,
  },
  currencyInput: {
    backgroundColor: 'white', 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 18, 
    padding: 10, 
    fontSize: 14, 
    marginBottom: 15, 
    marginHorizontal: 37,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 5, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    verticalAlign: 'middle',
    alignItems: 'center',
    backgroundColor: '#3a87e7',
    padding: 10,
    borderRadius: 15,
    marginTop: 13,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 10,
    alignItems: 'center',
  },
  uploadSuccessText: {
    color: '#586e26',
    fontSize: 15,
    fontWeight: 'heavy',
    textAlign: 'center',
  },
  pagarLabel: {
    marginTop: 10, 
  },
  pagarValue: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#555',
  },
});

  export default EditarGastoScreen;
  
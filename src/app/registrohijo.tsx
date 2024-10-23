import { Link, useRouter } from 'expo-router';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from 'react-native';
import CancelButton from '@/src/components/CancelButton';
import DropdownComponent from '@/src/components/dropdown';
import SaveButton from '@/src/components/SaveButton';
import InputComponent from '@/src/components/InputComponent';
import React, { useEffect, useState } from 'react';
import { State, City } from 'country-state-city';
import DateTimePicker from '@/src/components/DatePicker';
import * as ImagePicker from 'expo-image-picker';
import BasicAvatar from '@/src/dataDisplay/avatarPicker';

const registrarHijoScreen = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [provincias, setProvincias] = useState<string[]>([]);
    const [ciudades, setCiudades] = useState<string[]>([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
    const [errors, setErrors] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [documento, setDocumento] = useState('');
    const [sexoSeleccionado, setSexo] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();
    const [resetAvatar, setResetAvatar] = useState(false);

    const sexo = ["Nena", "Nene", "Otro"];
   
    const handleImageSelected = (uri: string) => {
        setImage(uri); // Guardar la imagen seleccionada en el estado
    };
    const handleImageSelect = (imageUrl: string | null) => {
        setImage(imageUrl); // Actualiza el estado de la imagen
    };
    const ValidateInput = () => {
        setErrors('');
        if (!nombre) {
            setErrors('El nombre es requerido');
            return false;
        }
        if (!apellido) {
            setErrors('El apellido es requerido');
            return false;
        }
        if (!fechaNacimiento) {
            setErrors('No se ha seleccionado la fecha de Nacimiento');
            return false;
        }
        if (!provinciaSeleccionada) {
            setErrors('No se ha seleccionado la provincia ');
            return false;
        }
        if (!ciudadSeleccionada) {
            setErrors('No se ha seleccionado la ciudad ');
            return false;
        }
        if (!documento) {
            setErrors('No se ha ingresado el documento');
            return false;
        }
        if (!sexoSeleccionado) {
            setErrors('No se ha seleccionado el sexo');
            return false;
        }
        return true;
    };

    const registrarHijo = () => {
        if (!ValidateInput()) {
            return;
        }

        // Aquí registrarías al hijo

        // Limpiar el formulario
        console.log({nombre,apellido,fechaNacimiento,provinciaSeleccionada,ciudadSeleccionada,documento,sexoSeleccionado})
        setNombre('');
        setApellido('');
        setFechaNacimiento(new Date());
        setProvinciaSeleccionada('');
        setCiudadSeleccionada('');
        setDocumento('');
        setSexo('');
        setImage(null);
        setResetAvatar(true); // Restablecer el avatar

        // Volver a establecer resetAvatar en false después de un breve retraso
        setTimeout(() => setResetAvatar(false), 500);
        
        
    };

    const noGuardarRegistro = () => {
        router.back();
    };

    useEffect(() => {
        const provinciasArg = State.getStatesOfCountry('AR').map((state) => state.name);
        setProvincias(provinciasArg);
    }, []);

    const handleProvinciaSelect = (provincia: string) => {
        setProvinciaSeleccionada(provincia);
        const selectedState = State.getStatesOfCountry('AR').find((state) => state.name === provincia);
        if (selectedState) {
            const ciudadesFiltradas = City.getCitiesOfState('AR', selectedState.isoCode).map((city) => city.name);
            setCiudades(ciudadesFiltradas);
        }
    };
  

    return (
        <View style={styles.container}>
            
            <View style={styles.container2}><BasicAvatar onImageSelected={handleImageSelected} reset={resetAvatar}/></View>
            
            <InputComponent label="Nombre" value={nombre} setFunction={setNombre} />
            <InputComponent label="Apellido" value={apellido} setFunction={setApellido} />
            <DateTimePicker currentDate={fechaNacimiento} onChange={setFechaNacimiento} label="Fecha de Nacimiento" />

            {/* Agrupación de provincia y ciudad en la misma línea */}
            <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Provincia</Text>
                    <DropdownComponent title="Seleccionar provincia" labels={provincias} onSelect={handleProvinciaSelect} />
                </View>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Ciudad</Text>
                    <DropdownComponent title="Seleccionar ciudad" labels={ciudades} onSelect={setCiudadSeleccionada} />
                </View>
            </View>

            {/* Agrupación de documento y sexo en otra línea */}
            <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Documento</Text>
                    <TextInput
                        value={documento}
                        onChangeText={setDocumento}
                        placeholder="12.456.789"
                        style={styles.smallInput}
                        keyboardType="numeric"
                        maxLength={8}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>Sexo</Text>
                    <DropdownComponent title="Seleccionar sexo" labels={sexo} onSelect={setSexo} />
                </View>
            </View>

            <Text style={styles.error}>{errors}</Text>
            <View style={styles.buttonContainer}>
                <CancelButton texto="Cancelar" onPress={noGuardarRegistro} />
                <SaveButton texto="Guardar" onPress={registrarHijo} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF", 
        justifyContent:"center",
        alignContent: "center"
    },
    container2:{
        backgroundColor: "#a9bb7c",
      
        borderTopLeftRadius: 10, // Esquinas superiores rectas
        borderTopRightRadius: 10, // Esquinas superiores rectas
        borderBottomLeftRadius: 100, // Ajusta este valor para el semicirculo
        borderBottomRightRadius: 100,
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
     
    
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 1,
        width: "90%",
    },
    dropdownContainer: {
        flex: 1,
        marginHorizontal: "0.01%",
        width: '90%',
    },
    smallInput: {
        width: '90%', // Ajustar al 90% para que tenga un tamaño consistente
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        marginLeft: "20%",
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
    label: {
      color: '#000',
      fontSize: 14,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      marginBottom: 5,
      marginLeft: '10%',
      marginRight: 10,
    },
    image: {
        width: '50%',
        aspectRatio: 1,
     alignSelf: 'center',
     borderRadius:25, // Esto hará que la imagen sea redonda
        overflow: 'hidden'
    },  

    
});

export default registrarHijoScreen;

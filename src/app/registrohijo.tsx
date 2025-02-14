import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import CancelButton from "@/src/components/CancelButton";
import DropdownComponent from "@/src/components/dropdown";
import SaveButton from "@/src/components/SaveButton";
import InputComponent from "@/src/components/InputComponent";
import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import DateTimePicker from "@/src/components/DatePicker";
import BasicAvatar from "@/src/dataDisplay/avatarPicker";
import {
  registrarHijo,
  verificarSegundoProgenitorAsociado,
} from "../services/hijoService";
import Colors from "../constants/Colors";

const registrarHijoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [provincias, setProvincias] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [errors, setErrors] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [documento, setDocumento] = useState<number>(0);
  const [sexoSeleccionado, setSexo] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();
  const [resetAvatar, setResetAvatar] = useState(false);

  const sexo = ["Masculino", "Femenino", "Otro"];

  const handleImageSelected = (uri: string) => {
    setImage(uri); // Guardar la imagen seleccionada en el estado
  };
  const handleImageSelect = (imageUrl: string | null) => {
    setImage(imageUrl); // Actualiza el estado de la imagen
  };
  const ValidateInput = () => {
    setErrors("");
    if (!nombre) {
      setErrors("El nombre es requerido");
      return false;
    }
    if (!apellido) {
      setErrors("El apellido es requerido");
      return false;
    }
    if (!fechaNacimiento) {
      setErrors("No se ha seleccionado la fecha de Nacimiento");
      return false;
    }
    if (!provinciaSeleccionada) {
      setErrors("No se ha seleccionado la provincia ");
      return false;
    }
    if (!ciudadSeleccionada) {
      setErrors("No se ha seleccionado la ciudad ");
      return false;
    }
    if (!documento) {
      setErrors("No se ha ingresado el documento");
      return false;
    }
    if (!sexoSeleccionado) {
      setErrors("No se ha seleccionado el sexo");
      return false;
    }
    return true;
  };

  const registroHijo = async () => {
    if (!ValidateInput()) {
      return;
    }
    try {
      await registrarHijo(
        nombre,
        apellido,
        fechaNacimiento,
        provinciaSeleccionada,
        ciudadSeleccionada,
        documento,
        sexoSeleccionado
      );
      setNombre("");
      setApellido("");
      setFechaNacimiento(new Date());
      setProvinciaSeleccionada("");
      setCiudadSeleccionada("");
      setDocumento(0);
      setSexo("");
      setImage(null);
      setResetAvatar(true);
      setTimeout(() => setResetAvatar(false), 500);

      const tieneSegundoProgenitorAsociado =
        await verificarSegundoProgenitorAsociado();
      if (tieneSegundoProgenitorAsociado) {
        router.replace("/(tabs)/gastos/");
      } else {
        router.replace("/vinculacionHijoOIngresoCodigo");
      }
    } catch (error) {
      alert("Error al registrar el hijo. Por favor, inténtalo de nuevo.");
      setErrors("Error al registrar el hijo.");
    }
  };

  const noGuardarRegistro = () => {
    router.back();
  };

  useEffect(() => {
    const provinciasArg = State.getStatesOfCountry("AR").map(
      (state) => state.name
    );
    setProvincias(provinciasArg);
  }, []);

  const handleProvinciaSelect = (provincia: string) => {
    setProvinciaSeleccionada(provincia);
    const selectedState = State.getStatesOfCountry("AR").find(
      (state) => state.name === provincia
    );
    if (selectedState) {
      const ciudadesFiltradas = City.getCitiesOfState(
        "AR",
        selectedState.isoCode
      ).map((city) => city.name);
      setCiudades(ciudadesFiltradas);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.container2}>
            <Text style={styles.titulo}>¡Registrá a tu hijo!</Text>
            <Text style={styles.subtitulo}>
              Completá con los datos personales de tu hijo para registrarlo.
            </Text>
          </View>

          <View style={styles.avatarContainer}>
            <BasicAvatar
              onImageSelected={handleImageSelected}
              reset={resetAvatar}
            />
            <View style={styles.container_mayor}>
              <InputComponent
                label="Nombre"
                value={nombre}
                setFunction={setNombre}
              />
              <InputComponent
                label="Apellido"
                value={apellido}
                setFunction={setApellido}
              />
              <DateTimePicker
                currentDate={fechaNacimiento}
                onChange={setFechaNacimiento}
                label="Fecha de Nacimiento"
              />

              <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Provincia</Text>
                  <DropdownComponent
                    title="Seleccionar provincia"
                    labels={provincias}
                    onSelect={handleProvinciaSelect}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Ciudad</Text>
                  <DropdownComponent
                    title="Seleccionar ciudad"
                    labels={ciudades}
                    onSelect={setCiudadSeleccionada}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Documento</Text>
                  <TextInput
                    value={documento ? documento.toString() : ""}
                    onChangeText={(text) => setDocumento(parseInt(text, 10))}
                    placeholder="12.456.789"
                    style={styles.smallInput}
                    keyboardType="numeric"
                    maxLength={8}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <Text style={styles.label}>Sexo</Text>
                  <DropdownComponent
                    title="Seleccionar sexo"
                    labels={sexo}
                    onSelect={setSexo}
                  />
                </View>
              </View>

              <Text style={styles.error}>{errors}</Text>
              <View style={styles.buttonContainer}>
                <CancelButton texto="Cancelar" onPress={noGuardarRegistro} />
                <SaveButton texto="Guardar" onPress={registroHijo} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
  },
  container2: {
    backgroundColor: Colors.verde.verdeIntermedio,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: "hidden",
    alignItems: "center",
    height: "0%",
    width: "100%",
    marginBottom: 30,
    flex: 1,
    paddingBottom: 60,
    paddingTop: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -80,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: "0.01%",
    width: "90%",
  },
  smallInput: {
    width: "70%",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: "20%",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: "10%",
    marginRight: 10,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
  },
  titulo: {
    marginTop: 10,
    fontSize: 30,
    textAlign: "center",
    color: Colors.negro.negroNormal,
    fontWeight: "bold",
  },
  subtitulo: {
    color: Colors.negro.negroNormal,
    textAlign: "center",
  },
  container_mayor: {
    marginTop: 7,
    paddingBottom: 100,
  },
});

export default registrarHijoScreen;

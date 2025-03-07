import { useRouter } from "expo-router";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import CancelButton from "@/src/components/CancelButton";
import DropdownComponent from "@/src/components/DropdownComponent";
import SaveButton from "@/src/components/SaveButton";
import InputComponent from "@/src/components/InputComponent";
import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import DateTimePicker from "@/src/components/DatePicker";
import {
  registrarHijo,
  verificarSegundoProgenitorAsociado,
} from "../services/hijoService";
import Colors from "../constants/Colors";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import LoadingIndicator from "../components/LoadingIndicator";

const RegistrarHijoScreen = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [provincias, setProvincias] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [documento, setDocumento] = useState<number>(0);
  const [sexoSeleccionado, setSexo] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const sexo = ["Masculino", "Femenino", "Otro"];
  const ValidateInput = () => {
    let errors = "";
    if (!nombre) {
      errors = "El nombre es requerido";
    }
    if (!apellido) {
      errors = "El apellido es requerido";
    }
    if (!fechaNacimiento) {
      errors = "No se ha seleccionado la fecha de Nacimiento";
    }
    if (fechaNacimiento > new Date()) {
      errors = "La fecha de nacimiento no puede ser mayor a la actual";
    }
    if (!provinciaSeleccionada) {
      errors = "No se ha seleccionado la provincia ";
    }
    if (!ciudadSeleccionada) {
      errors = "No se ha seleccionado la ciudad ";
    }
    if (!documento) {
      errors = "No se ha ingresado el documento";
    }
    if (!sexoSeleccionado) {
      errors = "No se ha seleccionado el sexo";
    }
    if (errors) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: errors,
      });
      return false;
    }

    return true;
  };

  const registroHijo = async () => {
    if (!ValidateInput()) {
      return;
    }
    try {
      setLoading(true);
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
      const tieneSegundoProgenitorAsociado =
        await verificarSegundoProgenitorAsociado();
      if (tieneSegundoProgenitorAsociado) {
        setLoading(false);
        router.replace("/(tabs)/gastos/gasto");
      } else {
        setLoading(false);
        router.replace("/VinculacionHijoOIngresoCodigoScreen");
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al registrar el hijo. Por favor, inténtalo de nuevo.",
      });
    }
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

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container2}>
          <Text style={styles.titulo}>¡Registrá a tu hijo!</Text>
          <Text style={styles.subtitulo}>
            Completá con los datos personales de tu hijo para registrarlo.
          </Text>
        </View>
        <View style={styles.container_mayor}>
          <InputComponent
            label="Nombre"
            value={nombre}
            setFunction={setNombre}
            autoCapitalize="words"
          />
          <InputComponent
            label="Apellido"
            value={apellido}
            setFunction={setApellido}
            autoCapitalize="words"
          />

          <InputComponent
            label="Nro. de documento"
            value={documento ? documento.toString() : ""}
            setFunction={(text) => setDocumento(parseInt(text, 10))}
            keyboardType="numeric"
            maxLength={8}
          />
          <DateTimePicker
            currentDate={fechaNacimiento}
            onChange={setFechaNacimiento}
            label="Fecha de Nacimiento"
          />

          <Text style={styles.label}>Provincia</Text>
          <DropdownComponent
            title="Seleccionar provincia"
            labels={provincias}
            onSelect={handleProvinciaSelect}
          />
          <Text style={styles.label}>Ciudad</Text>
          <DropdownComponent
            title="Seleccionar ciudad"
            labels={ciudades}
            onSelect={setCiudadSeleccionada}
          />

          <Text style={styles.label}>Sexo</Text>
          <DropdownComponent
            title="Seleccionar sexo"
            labels={sexo}
            onSelect={setSexo}
          />

          <View style={styles.buttonContainer}>
            <CancelButton texto="Cancelar" onPress={() => router.back()} />
            <SaveButton texto="Guardar" onPress={registroHijo} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container2: {
    backgroundColor: Colors.verde.verdeIntermedio,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    height: "16%",
    width: "100%",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: "7%",
    marginTop: 10,
  },
  titulo: {
    marginTop: 20,
    fontSize: 30,
    textAlign: "center",
    color: Colors.negro.negroNormal,
    fontWeight: "bold",
  },
  subtitulo: {
    color: Colors.negro.negroNormal,
    fontSize: 14,
    textAlign: "center",
  },
  container_mayor: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 13,
  },
});

export default RegistrarHijoScreen;

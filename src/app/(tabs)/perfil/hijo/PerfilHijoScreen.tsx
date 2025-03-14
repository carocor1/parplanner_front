import { obtenerUsuario } from "@/src/services/userService";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "@/src/constants/Colors";
import CustomTextInput from "@/src/components/TextInput";
import CustomButton from "@/src/components/CustomButton";
import CustomDropdown from "@/src/components/CustomDropdown";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { City, State } from "country-state-city";
import { actualizarHijo, obtenerHijo } from "@/src/services/hijoService";
import { Hijo } from "@/src/interfaces/HijoInterface";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const dataSexo = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
  { label: "Otro", value: "Otro" },
];

const PerfilHijoScreen = () => {
  const [hijo, setHijo] = useState<Hijo | null>(null);
  const [sexo, setSexo] = useState<string | null>(null);
  const [provincia, setProvincia] = useState<string | null>(null);
  const [ciudad, setCiudad] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [documento, setDocumento] = useState<number>();
  const [isFocusSexo, setIsFocusSexo] = useState(false);
  const [isFocusProvincia, setIsFocusProvincia] = useState(false);
  const [isFocusCiudad, setIsFocusCiudad] = useState(false);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHijo = async () => {
    try {
      setLoading(true);
      const usuario = await obtenerUsuario();
      const hijo = await obtenerHijo(usuario.hijo.id);
      if (hijo) {
        setHijo(hijo);
        setNombre(hijo.nombre);
        setApellido(hijo.apellido);
        setDocumento(hijo.documento);
        setSexo(hijo.sexo);
        setProvincia(hijo.provincia);
        setCiudad(hijo.ciudad);
      }
    } catch (error) {
      console.error("Error al obtener el hijo:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvincias = () => {
    const provinciasArg = State.getStatesOfCountry("AR").map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setProvincias(provinciasArg);
  };

  const fetchCiudades = (provincia: string) => {
    const selectedState = State.getStatesOfCountry("AR").find(
      (state) => state.name === provincia
    );
    if (selectedState) {
      const ciudadesFiltradas = City.getCitiesOfState(
        "AR",
        selectedState.isoCode
      ).map((city) => ({
        label: city.name,
        value: city.name,
      }));
      setCiudades(ciudadesFiltradas);
    }
  };

  const validateInput = () => {
    const validationRules = [
      { condition: !nombre, message: "El nombre es requerido" },
      { condition: !apellido, message: "El apellido es requerido" },
      { condition: !documento, message: "El documento es requerido" },
      { condition: !sexo, message: "El sexo es requerido" },
      { condition: !provincia, message: "La provincia es requerida" },
      { condition: !ciudad, message: "La ciudad es requerida" },
    ];

    for (const rule of validationRules) {
      if (rule.condition) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Error",
          textBody: rule.message,
        });
        return false;
      }
    }
    return true;
  };

  const actualizarDatos = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      if (hijo && provincia && ciudad && documento && sexo) {
        await actualizarHijo(
          hijo.id,
          nombre,
          apellido,
          provincia,
          ciudad,
          documento,
          sexo
        );
        fetchHijo();
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  };

  useEffect(() => {
    fetchHijo();
    fetchProvincias();
  }, []);

  useEffect(() => {
    if (provincia) {
      fetchCiudades(provincia);
    }
  }, [provincia]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (hijo) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container_principal}>
          <Text style={styles.title}>
            {hijo.nombre} {hijo.apellido}
          </Text>

          <CustomTextInput
            label="Nombre"
            placeholder="Escribe el nombre de tu hijo"
            value={nombre}
            onChangeText={(nombre) => {
              setNombre(nombre);
              setHijo({ ...hijo, nombre });
            }}
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Apellido"
            placeholder="Escribe tu apellido"
            value={apellido}
            onChangeText={(apellido) => {
              setApellido(apellido);
              setHijo({ ...hijo, apellido });
            }}
            primaryColor="purple"
            icon="pencil"
          />
          <CustomTextInput
            label="Documento"
            placeholder="Escribe tu documento"
            value={documento ? documento.toString() : ""}
            onChangeText={(documento) => {
              const docNumber = parseInt(documento, 10);
              setDocumento(docNumber);
              setHijo({ ...hijo, documento: docNumber });
            }}
            keyboardType="numeric"
            primaryColor="purple"
            icon="pencil"
          />
          <CustomDropdown
            label="Sexo"
            data={dataSexo}
            value={sexo || ""}
            onChange={setSexo}
            isFocus={isFocusSexo}
            setIsFocus={setIsFocusSexo}
            primaryColor="purple"
          />
          <CustomDropdown
            label="Provincia"
            data={provincias}
            value={provincia || ""}
            onChange={setProvincia}
            isFocus={isFocusProvincia}
            setIsFocus={setIsFocusProvincia}
            primaryColor="purple"
          />
          <CustomDropdown
            label="Ciudad"
            data={ciudades}
            value={ciudad || ""}
            onChange={setCiudad}
            isFocus={isFocusCiudad}
            setIsFocus={setIsFocusCiudad}
            primaryColor="purple"
          />

          <CustomButton
            onPress={actualizarDatos}
            title="ACTUALIZAR DATOS"
            backgroundColor={Colors.amarillo.amarilloNormal}
            textColor="white"
          />
        </View>
      </ScrollView>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container_principal: {
    padding: 20,
    backgroundColor: Colors.gris.fondo,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default PerfilHijoScreen;

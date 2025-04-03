import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getEventos, registrarEvento } from "../services/evento";
import Colors from "../constants/Colors";
import EventoItem from "../components/EventoItem";
import LoadingIndicator from "@/src/components/LoadingIndicator"; 
import { Evento } from "../interfaces/EventoInteface";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

const DocumentoScreen = () => {
  const [loading, setLoading] = useState(true);
  const [listaEventos, setListaEventos] = useState<Evento[]>([]);
  const [usuarioLogueadoId, setUsuarioLogueadoId] = useState(0); 

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const eventos = await getEventos(); 
      setListaEventos(eventos);
    } catch (error) {
      console.error("Error al recuperar los eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleRecargar = () => {
    fetchEventos(); 
  };

  if (loading) {
    return <LoadingIndicator />; 
  }
  const registrarEvento = () => {

    router.push("/(tabs)/calendarios/compromiso/RegistrarCompromisoScreen");
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.containerTitulo}>
        <Text style={styles.titulo}>EVENTOS</Text>
      </View>

      {listaEventos.length>0 &&<View style={styles.containerTexto}>
        <Text style={styles.texto}>PENDIENTES</Text></View>}

      <ScrollView contentContainerStyle={styles.EventosContainer}>
        {listaEventos.length > 0 ? (
          
          listaEventos.map((evento) => (
            <EventoItem
              key={evento.id}
              evento={evento}
              usuarioLogueadoId={usuarioLogueadoId}
              onRecargar={handleRecargar} 
            />
          ))
        ) : (

          <View style={styles.sinEventosContainer}>
            
            
            <MaterialIcons name="event" size={200} color="lightgray" />
            <Text style={styles.textoSinEvento}>No hay eventos disponibles. Crea uno!</Text>

            <TouchableOpacity style={styles.button} onPressIn={registrarEvento}> 
              <Text style={styles.buttonText}>CREAR EVENTO</Text>
            </TouchableOpacity>
            
          </View>
         
          
          
        )}
      </ScrollView>
    </View>
  );
};

export default DocumentoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  EventosContainer: {
   
    backgroundColor: "white", 
    justifyContent:"flex-start", 
    marginTop:20,
    flex: 1,
  },
  noEventosText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  containerTitulo: {
    backgroundColor: Colors.rosa.rosaPetitte,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    height: "16%",
    width: "100%",
    padding: 10,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.rosa.rosaOscuro,
  },
  texto: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  containerTexto: {
    backgroundColor: Colors.lila.lilaClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    width: "100%",
    marginTop:40
  },
  textoSinEvento: {
    color: Colors.lila.lilaNormal,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginTop:20
  },
  sinEventosContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    backgroundColor: Colors.marron.marronClaro,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: Colors.marron.marronNormal,
    fontWeight: "bold",
    fontSize: 24,
  },
  
});

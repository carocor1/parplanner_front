import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ProponerParticionScreen from './particionModal';
import { categorias, gastos } from '@/src/data/data';
import { useLocalSearchParams, useRouter } from 'expo-router';

//OBTIENE COMO PARÁMETRO EL GASTO Y EL USUARIOID
const DetalleGastoScreen: React.FC = () => {
  const { id, usuarioId } = useLocalSearchParams(); // Usa useLocalSearchParams para obtener los parámetros
  const parsedGastoId = id ? Number(id) : null; // Convertir a número, si existe
  const parsedGasto = gastos.find(gasto => gasto.id === parsedGastoId);


   console.log(parsedGastoId)
    console.log(usuarioId)


  // Si el gasto no está disponible
  if (!parsedGasto) {
    return <Text>Gasto no disponible</Text>;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  if (!parsedGasto) {
    return <Text>Gasto no disponible</Text>;
  }

  const esPendiente = parsedGasto.estado.nombre === 'Pendiente';

  // Obtener el nombre de la categoría del gasto


  return (
    <View style={styles.container}>
      <View style={[esPendiente ? styles.rectanguloPendiente : styles.rectanguloPagada, { marginBottom: 5 }]}>
        <Text style={esPendiente ? styles.textoPendiente : styles.textoPagada}>
          {parsedGasto.estado.nombre.toUpperCase()}
        </Text>
      </View>

      {/* Título y descripción del gasto */}
      <Text style={styles.tituloLabel}>Título del gasto: </Text>
      <Text style={styles.titulo}>{parsedGasto.titulo}</Text>
      <Text style={styles.descripcion}>{parsedGasto.descripcion}</Text>

      {/* Mostrar la categoría del gasto */}
      <View style={styles.categoriaConteiner}>
        <Text style={styles.categoriaLabel}>Categoría: </Text>
        <Text style={styles.categoria}>{parsedGasto.categoria.nombre}</Text>  
      </View>

      {/* Monto total del gasto */}
      <View style={styles.contenedorMonto}>
        <Text style={styles.monto}>Total:</Text>
        <Text style={styles.montoImportado}>${parsedGasto.monto}</Text>
      </View>

      {/* Particiones del gasto */}
      <View style={styles.contenedorParticiones}>
        <View
          style={[
            styles.particionIndividual,
            parsedGasto.progenitorCreador.id === Number(usuarioId) && styles.particionUsuarioLogueado,
          ]}
        >
          <Text style={styles.tituloParticion}>Partición de</Text>
          <Text style={styles.tituloParticion}>{parsedGasto.progenitorCreador.nombre}:</Text>
          <Text style={styles.particionValue}>{parsedGasto.particionProgenitorCreador}%</Text>
          <View style={styles.lineaDivisoria}></View>
          <Text style={styles.corresponde}>Corresponde:</Text>
          <Text style={styles.particionValue}>
            ${(parsedGasto.particionProgenitorCreador * parsedGasto.monto) / 100}
          </Text>
        </View>

        <View
          style={[
            styles.particionIndividual,
            parsedGasto.progenitorParticipe.id === Number(usuarioId) && styles.particionUsuarioLogueado,
          ]}
        >
          <Text style={styles.tituloParticion}>Partición de</Text>
          <Text style={styles.tituloParticion}>{parsedGasto.progenitorParticipe.nombre}:</Text>
          <Text style={styles.particionValue}>{parsedGasto.particionProgenitorParticipe}%</Text>
          <View style={styles.lineaDivisoria}></View>
          <Text style={styles.corresponde}>Corresponde:</Text>
          <Text style={styles.particionValue}>
            ${(parsedGasto.particionProgenitorParticipe * parsedGasto.monto) / 100}
          </Text>
        </View>
      </View>

      {/* Botón para descargar comprobante de compra */}
      <TouchableOpacity>
        <MaterialIcons name="attach-file" size={24} color="white" />
        <Text>Descargar comprobante de compra</Text>
      </TouchableOpacity>

      {/* Botón para proponer nueva partición si el estado es pendiente y no es el creador */}
      {esPendiente && (
        <TouchableOpacity style={styles.botonProponerParticion} onPress={openModal}>
          <Text style={styles.buttonText}>PROPONER NUEVA PARTICIÓN</Text>
        </TouchableOpacity>
      )}

      {/* Modal para proponer nueva partición */}
      <ProponerParticionScreen
        visible={modalVisible}
        onClose={closeModal}
        gasto={parsedGasto}
        idUsuarioLogueado={Number(usuarioId)} // Convertir el usuarioId a número
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  tituloLabel: {
    fontSize: 18,
    color: '#666',
    alignSelf: 'center',
    marginTop: 10,
  },
  categoriaConteiner: {
    flexDirection: 'row',
    justifyContent: 'center', // Centramos en el eje X
    marginTop: 10,
    marginBottom: 8,
  },
  contenedorMonto: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  categoriaLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center'
  },
  loadingText: {
    alignSelf: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    color: '#888',
  },
  errorText: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
  },
  monto: {
    alignSelf: 'center',
    fontSize: 18,
    marginRight: 10, 
  },
  montoImportado: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#0353a4', // Azul no tan brillante
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    textAlign: 'center'
  },
  descripcion: {
    fontSize: 18,
    color: '#666', // Color de la descripción
    alignSelf: 'center',
  },
  categoria: {
    fontSize: 18,
    color: '#bd4f6c',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tituloParticion: {
    fontSize: 16,
    color: '#333',
  },
  particionValue: {
    fontSize: 30,
    color: '#555',
    fontWeight: 'bold',
  },
  corresponde: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  particionIndividual: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  particionUsuarioLogueado: {
    borderColor: '#014f86', // Color del borde para el usuario logueado
    borderWidth: 5,
  },
  contenedorParticiones: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaciado uniforme entre particiones
  },
  lineaDivisoria: {
    borderBottomColor: '#ddd', // Color de la línea divisoria
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 5, // Espacio alrededor de la línea
  },
  botonProponerParticion: {
    backgroundColor: '#DF732E', // Color de fondo naranja
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginLeft: 10,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rectanguloPendiente: {
    backgroundColor: '#FFE5B4', // Naranja claro
    paddingVertical: 10, 
    paddingHorizontal: 40,
    borderRadius: 15,
    alignSelf: 'center',
  },
  textoPendiente: {
    color: '#cd8d0d', // Naranja oscuro
    fontWeight: 'bold',
    fontSize: 25,
  },
  rectanguloPagada: {
    backgroundColor: '#ccdaed', // Azul claro
    paddingVertical: 10, 
    paddingHorizontal: 40,
    borderRadius: 15,
    alignSelf: 'center',
  },
  textoPagada: {
    color: '#5f80ad', // Azul oscuro
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default DetalleGastoScreen;



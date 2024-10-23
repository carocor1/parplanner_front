import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ProponerParticionScreen from './particionModal';
import { useLocalSearchParams } from 'expo-router';
import { url } from '@/src/constants/constants';
import { getGastoById } from '@/src/services/gastoService';

// OBTIENE COMO PARÁMETRO EL GASTO Y EL USUARIOID
const DetalleGastoScreen: React.FC = () => {
  const { id, usuarioId } = useLocalSearchParams(); 
  const parsedGastoId = id ? Number(id) : null; 

  const [gasto, setGasto] = useState<any>(null);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  
  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    fetchGasto();
  }

  const fetchGasto = async () => {
    try {
      if (parsedGastoId){
        setLoading(true);
        const gasto = await getGastoById(parsedGastoId);
        setGasto(gasto);
      }
    } catch (error) {
      console.error("Error al cargar el gasto:", error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchGasto(); 
  }, [parsedGastoId]);

  // Si estamos cargando los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!gasto) {
    return <Text>Gasto no disponible</Text>;
  }

  const esPendiente = gasto.estado.nombre === 'Pendiente';

  return (
    <View style={styles.container}>
      <View style={[esPendiente ? styles.rectanguloPendiente : styles.rectanguloPagada, { marginBottom: 5 }]}>
        <Text style={esPendiente ? styles.textoPendiente : styles.textoPagada}>
          {gasto.estado.nombre.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.tituloLabel}>Título del gasto: </Text>
      <Text style={styles.titulo}>{gasto.titulo}</Text>
      <Text style={styles.descripcion}>{gasto.descripcion}</Text>

      <View style={styles.categoriaConteiner}>
        <Text style={styles.categoriaLabel}>Categoría: </Text>
        <Text style={styles.categoria}>{gasto.categoria.nombre}</Text>  
      </View>

      <View style={styles.contenedorMonto}>
        <Text style={styles.monto}>Total:</Text>
        <Text style={styles.montoImportado}>${gasto.monto}</Text>
      </View>

      <View style={styles.contenedorParticiones}>
        <View style={[
          styles.particionIndividual,
          gasto.progenitorCreador.id === Number(usuarioId) && styles.particionUsuarioLogueado,
        ]}>
          <Text style={styles.tituloParticion}>Partición de</Text>
          <Text style={styles.tituloParticion}>{gasto.progenitorCreador.nombre}:</Text>
          <Text style={styles.particionValue}>{gasto.particionProgenitorCreador}%</Text>
          <View style={styles.lineaDivisoria}></View>
          <Text style={styles.corresponde}>Corresponde:</Text>
          <Text style={styles.particionValue}>${(gasto.particionProgenitorCreador * gasto.monto) / 100}</Text>
        </View>

        <View style={[
          styles.particionIndividual,
          gasto.progenitorParticipe.id === Number(usuarioId) && styles.particionUsuarioLogueado,
        ]}>
          <Text style={styles.tituloParticion}>Partición de</Text>
          <Text style={styles.tituloParticion}>{gasto.progenitorParticipe.nombre}:</Text>
          <Text style={styles.particionValue}>{gasto.particionProgenitorParticipe}%</Text>
          <View style={styles.lineaDivisoria}></View>
          <Text style={styles.corresponde}>Corresponde:</Text>
          <Text style={styles.particionValue}>${(gasto.particionProgenitorParticipe * gasto.monto) / 100}</Text>
        </View>
      </View>

      <TouchableOpacity>
        <MaterialIcons name="attach-file" size={24} color="white" />
        <Text>Descargar comprobante de compra</Text>
      </TouchableOpacity>

      {esPendiente && (
        <TouchableOpacity style={styles.botonProponerParticion} onPress={openModal}>
          <Text style={styles.buttonText}>PROPONER NUEVA PARTICIÓN</Text>
        </TouchableOpacity>
      )}

      <ProponerParticionScreen
        visible={modalVisible}
        onClose={closeModal}
        gasto={gasto}
        idUsuarioLogueado={Number(usuarioId)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Color de fondo de la pantalla de carga
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#6A5ACD', // Color del texto de carga
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



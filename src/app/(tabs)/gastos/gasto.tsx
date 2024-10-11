import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { gastos } from '../../../data/data'; 
import { router } from 'expo-router'; 
import GastoItem from '@/src/components/GastoItem';
import { FontAwesome } from '@expo/vector-icons';

export interface Gasto {
  id: number; 
  titulo: string;
  monto: number; 
  descripcion: string; 
  comprobanteCompra: string; 
  particionProgenitorCreador: number; 
  particionProgenitorParticipe: number;
  progenitorCreador: { 
    id: number;
    nombre: string; 
    apellido: string;
  };
  progenitorParticipe: { 
    id: number; 
    nombre: string;
    apellido: string;
  };
  estado: {
    nombre: string; // Nombre del estado (e.g., 'Pendiente' o 'Pagada')
  };
  fecha: string; // Considera que la fecha debe estar en un formato reconocible
  categoria: {id:number; nombre:string}
}

const progenitorLogueadoId = 1; 
const GastosScreen = () => {
  const [listaGastos, setListaGastos] = useState<Gasto[]>([]);
  const [deudaTotal, setDeudaTotal] = useState<number>(0); // Estado para almacenar la deuda total

  useEffect(() => {
    // Simula la recuperación de los gastos
    setListaGastos(gastos); 
  }, []);


  useEffect(() => {
    const calcularDeuda = () => {
      const deuda = listaGastos.reduce((total, gasto) => {
        if (gasto.estado.nombre === 'Pendiente' && gasto.progenitorParticipe.id === progenitorLogueadoId) {
          return total + ((gasto.monto * gasto.particionProgenitorParticipe)/100);
        }
        return total;
      }, 0);
      setDeudaTotal(deuda);
    };

    calcularDeuda(); // Llama a la función de cálculo al cargar la lista de gastos
  }, [listaGastos]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Rectángulo con información de deuda */}
        <View style={styles.deudaContainer}>
          <Text style={styles.debeText}>Debés</Text>
          <Text style={styles.cantidadText}>${deudaTotal.toFixed(2)}</Text>
          <Text style={styles.pagoText}>Pagá con Mercado Pago</Text>
        </View>

        {/* Contenedor de la lista de gastos */}
        <View style={styles.gastosContainer}>
          <Text style={styles.gastosTitle}>Gastos</Text>
          {listaGastos.map((gasto) => (
            <GastoItem key={gasto.id} gasto={gasto} usuarioLogueadoId={progenitorLogueadoId} />
          ))}
        </View>
      </ScrollView>

      {/* Botón flotante circular */}
      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => router.push('/gastos/registrargasto')}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Color de fondo
  },
  deudaContainer: {
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#6A5ACD', 
    paddingBottom: 90, 
    paddingTop:60,
    width: '100%', 

  },
  debeText: {
    color: 'rgba(255, 255, 255, 0.7)', 
    fontSize: 16, 
  },
  cantidadText: {
    color: 'white',
    fontSize: 35, 
    fontWeight: 'bold', 
    paddingBottom: 5
  },
  pagoText: {
    fontSize: 16, 
    textAlign: 'right', 
    color: 'rgba(255, 255, 255, 0.7)'
  },
  gastosContainer: {
    marginTop: -65, // Se superpone al rectángulo lila (1/4 del alto del contenedor) 
    backgroundColor: '#fff', // Fondo blanco para los gastos
    borderRadius: 15, // Bordes redondeados
    shadowColor: '#000', // Sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4, // Elevación para Android
    zIndex: 1, // Este contenedor se renderiza por encima del rectángulo lila
    width: '92%', // Ajusta el ancho a un porcentaje de la pantalla
    alignSelf: 'center', // Centra el contenedor horizontalmente
  },
  gastosTitle: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 18, // Tamaño de fuente
    fontWeight: 'bold', // Negrita
    marginBottom: 10, // Espaciado debajo del título
  },
  botonFlotante: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#778c43', // Color del botón
    alignItems: 'center',
    justifyContent: 'center',
    right: 20, // A 20px del borde derecho
    bottom: 20, // A 20px del borde inferior
    zIndex: 2, // Asegura que esté sobre todo lo demás
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra para Android
  },
});

export default GastosScreen;
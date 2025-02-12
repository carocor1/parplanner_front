import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Gasto } from '../interfaces/Gasto';

interface GastoItemProps {
  gasto: Gasto; // Objeto de gasto
  usuarioLogueadoId: number; // ID del usuario logueado
}

const GastoItem: React.FC<GastoItemProps> = ({ gasto, usuarioLogueadoId }) => {
  const esCreador = gasto.progenitorCreador.id === usuarioLogueadoId; 
  const esPendiente = gasto.estado.nombre === 'Pendiente';

  const responsabilidadParticipante = (gasto.monto * (gasto.particionProgenitorParticipe / 100)).toFixed(2);

  const calcularMensajeDeuda = (): string => {
    if (esPendiente && esCreador) {
      return 'te debe';
    } else if (esPendiente) {
      return 'Debés'; // Mensaje si es participante y pendiente
    } else if (esCreador) {
      return 'te pagó'; // Mensaje si es creador y pagado
    } else {
      return 'Pagaste'; // Mensaje si es participante y pagado
    }
  };

  const mensajeDeuda = calcularMensajeDeuda();

  return (
    <View style={styles.gastoContainer}>
      <View style={styles.estiloAlineacion}>
        {/* Sección de 60% del contenedor */}
        <View style={{ flex: 0.6 }}>
          <Text style={styles.titulo}>{gasto.titulo}</Text>
          <Text style={{ marginBottom: 2 }}>{gasto.fecha}</Text>
          <Text style={esCreador ? styles.textoLila : styles.textoNaranja}>
            {gasto.progenitorCreador.nombre} {gasto.progenitorCreador.apellido}
            {esCreador && ' (Vos)'}
          </Text>
          <Text style={{ marginBottom: 2 }}>
            Partición ({gasto.particionProgenitorCreador}/{gasto.particionProgenitorParticipe})
          </Text>
          <Text style={{ marginBottom: 2 }}>Total: ${gasto.monto}</Text>
        </View>

        {/* Sección de 40% del contenedor */}
        <View style={styles.seccionDerecha}>
          <View style={[esPendiente ? styles.rectanguloPendiente : styles.rectanguloPagada, { marginBottom: 5 }]}>
            <Text style={esPendiente ? styles.textoPendiente : styles.textoPagada}>
              {gasto.estado.nombre.toUpperCase()}
            </Text>
          </View>
          <Text style={{ marginBottom: 1 }}>
            {mensajeDeuda.includes('te debe') || mensajeDeuda.includes('pagó') ? (
              <Text>{gasto.progenitorParticipe.nombre} </Text>
            ) : null}
            {mensajeDeuda}
          </Text>
          <Text style={esPendiente ? styles.textoRojo : styles.textoVerde}>
            ${responsabilidadParticipante}
          </Text>

          {/* Botón personalizado Abrir */}
          <View style= {styles.botones}>
            {/* Mostrar botón Editar solo si el usuario logueado es el creador */}
            {esCreador && esPendiente && (
              <TouchableOpacity 
                style={styles.botonAbrir} 
                onPress={() => router.push({
                  pathname: `../gastos/edit/${gasto.id}`,
                  params: {  // Pasar gasto correctamente
                    usuarioId: usuarioLogueadoId   // Pasar ID del usuario
                  }
                })}
              >
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>)}
            
            <TouchableOpacity 
              style={styles.botonAbrir} 
              onPress={() => router.push({
                pathname: `../gastos/${gasto.id}`,
                params: {  // Pasar gasto correctamente
                  usuarioId: usuarioLogueadoId   // Pasar ID del usuario
                }
              })}
            >
              <Text style={styles.textoBoton}>Abrir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gastoContainer: {
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: 'gray',
  },
  seccionDerecha: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
  },
  estiloAlineacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoLila: {
    color: '#434444',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  textoNaranja: {
    color: '#cd8d0d',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  textoVerde: {
    color: '#7cb518',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textoRojo: {
    color: '#d62828',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rectanguloPendiente: {
    backgroundColor: '#FFE5B4', // Naranja claro
    padding: 5,
    borderRadius: 10,
  },
  textoPendiente: {
    color: '#cd8d0d', // Naranja oscuro
    fontWeight: 'bold',
  },
  rectanguloPagada: {
    backgroundColor: '#ccdaed', // Azul claro
    paddingHorizontal: 14,
    padding: 5,
    borderRadius: 10,
  },
  textoPagada: {
    color: '#5f80ad', // Azul oscuro
    fontWeight: 'bold',
  },
  botonAbrir: {
    backgroundColor: 'white',
    borderColor: '#0077b6',
    borderWidth: 2,
    borderRadius: 15,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginRight: 8,
  },
  textoBoton: {
    color: '#0077b6',
    fontSize: 12,
    marginRight: 8,
    marginLeft: 8,
  },
  botones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  }
});

export default GastoItem;

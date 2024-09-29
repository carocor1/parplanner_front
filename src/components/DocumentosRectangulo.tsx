import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';

// Definición del tipo de props
type DocumentoRectanguloProps = {
    titulo: string;
    contenido: string;
    imagen: 'vacunas' | 'alergias' | 'historialclinico' | 'documentos'; // Prop opcional para la imagen
};

const images = {
    vacunas: require('../../assets/images/vacunas.jpg'), // Asegúrate de que la ruta sea correcta
    alergias: require('../../assets/images/alergias.png'), // Otras imágenes si es necesario
    historialclinico: require('../../assets/images/historialclinico.jpg'), 
    documentos: require('../../assets/images/documentos.jpg'), 
};



// Obtener las dimensiones de la pantalla
const { width } = Dimensions.get('window');

const DocumentoRectangulo: React.FC<DocumentoRectanguloProps> = ({ titulo, contenido, imagen }) => {
    return (
        <View style={styles.card}>
            <Image source={images[imagen]} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{titulo}</Text>
                <Text style={styles.content}>{contenido}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        width: width * 0.9, // El ancho será el 90% del ancho de la pantalla
        height: 150, // Fija una altura para que todos los rectángulos sean iguales
        borderRadius: 10, // Bordes redondeados
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5, // Para Android
        marginVertical: 10, // Espacio entre rectángulos
        flexDirection: 'row', // Para colocar la imagen y el texto en fila
    },
    image: {
        width: '33%', // La imagen ocupa 1/3 del rectángulo
        height: '100%', // La imagen ocupa toda la altura del rectángulo
        borderTopLeftRadius: 10, // Bordes redondeados en la parte superior izquierda
        borderBottomLeftRadius: 10, // Bordes redondeados en la parte inferior izquierda
    },
    textContainer: {
        flex: 1, // Ocupa el resto del espacio disponible
        padding: 10, // Padding para el contenido
        justifyContent: 'center', // Centra el contenido verticalmente
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    content: {
        fontSize: 14,
        color: '#333',
    },
});

export default DocumentoRectangulo;

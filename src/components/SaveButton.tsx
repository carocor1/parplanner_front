import { StyleSheet, Text, TouchableOpacity } from "react-native";

type SaveButtonProps = {
    texto: string;
    onPress: () => void; 
};

const SaveButton: React.FC<SaveButtonProps> = ({ texto, onPress }) => {
    return (
        <TouchableOpacity style={styles.saveButton} onPress={onPress}> 
          <Text style={styles.buttonText}>{texto}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: '#DF732E', //color de fondo naranja
        paddingVertical: 15, // Aumenta el padding vertical
        paddingHorizontal: 30, // Aumenta el padding horizontal
        borderRadius: 25, // Aumenta el borderRadius
        marginLeft: 10,
        width: '45%', // Aumenta el ancho del botón
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center', // Centra el texto en el botón
    },
});

export default SaveButton;

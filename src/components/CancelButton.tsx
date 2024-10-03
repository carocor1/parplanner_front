import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CancelButtonProps = {
    texto: string;
    onPress: () => void; 
};

const CancelButton: React.FC<CancelButtonProps> = ({ texto, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>{texto}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cancelButton: {
        backgroundColor: 'white',
        borderColor: '#DF732E',
        borderWidth: 2,
        paddingVertical: 15, // Aumenta el padding vertical
        paddingHorizontal: 30, // Aumenta el padding horizontal
        borderRadius: 25, // Aumenta el borderRadius
        width: '45%', // Aumenta el ancho del botón
      },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center', // Centra el texto en el botón
    },
    cancelButtonText: {
        color: '#DF732E',
        fontWeight: 'bold',
        textAlign: 'center', // Centra el texto en el botón
      },
});

export default CancelButton;

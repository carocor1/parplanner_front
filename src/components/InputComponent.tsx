import { View, Text, TextInput, StyleSheet } from "react-native";


type InputComponentProps = {
    label: string;
    value: string;
    setFunction: (text: string) => void;
};

const InputComponent: React.FC<InputComponentProps> = ({ label, value, setFunction }) => {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}                    // Se asigna el valor actual del input
                onChangeText={setFunction}       // Se pasa la función para actualizar el valor
                placeholder={label}              // Usa el label como placeholder
                style={styles.input}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    inputGroup: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
      },
      label: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: '10%',
      },
      input: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
      },

})

export default InputComponent;
import { Stack } from "expo-router";


export default function EditLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={
        {
            title:'Editar Gasto',
            headerStyle: {
              backgroundColor: '#96ac60', // Color de fondo del header
            },
            headerTintColor: '#fff'
        }
      }/>
    </Stack>
  );
}

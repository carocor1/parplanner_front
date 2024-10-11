import { Stack, Tabs } from "expo-router";


export default function GastosLayout() {
  return (
    <Stack>
      <Stack.Screen name="gasto" options={
        {
            title:'Gastos',
            headerStyle: {
              backgroundColor: '#96ac60', // Color de fondo del header
            },
            headerTintColor: '#fff'
        }
      }/>
      <Stack.Screen name="registrargasto"options={
        {
            title:'Registrar gasto',
            headerStyle: {
              backgroundColor: '#96ac60', // Color de fondo del header
            },
            headerTintColor: '#fff'
        }
      }/>
      <Stack.Screen name="edit" options={
        {
            title:'Editar Gasto',
            headerShown: false
        }
      }/>
      <Stack.Screen name="[id]" options={
        {
            title:'Detalle Gasto',
            headerStyle: {
              backgroundColor: '#96ac60', // Color de fondo del header
            },
            headerTintColor: '#fff'
        }
      }/>
    </Stack>
  );
}

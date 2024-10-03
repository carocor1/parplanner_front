import { Stack } from "expo-router";


export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="gastos" options={
        {
            title:'Gastos'
        }
      }/>
      <Stack.Screen name="registrargasto"options={
        {
            title:'Registrar gasto'
        }
      }/>
    </Stack>
  );
}

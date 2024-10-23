import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#586e26', // Active tab text/icon color
    tabBarInactiveTintColor: '#ffff',  // Inactive tab text/icon color
    tabBarStyle: {
      backgroundColor: '#96ac60', 
      height: 53, // Hacer que la barra de pestañas sea más alta
      paddingBottom: 5,
    },
    headerShown: useClientOnlyValue(false, true), // Controla la visibilidad del header
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Calendario',
      tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
      headerStyle: {
        backgroundColor: '#96ac60', // Color de fondo del header
      },
      headerTintColor: '#fff', // Color del texto y de los íconos del header
      headerRight: () => (
        <Link href="/modal" asChild>
          <Pressable>
            {({ pressed }) => (
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme ?? 'light'].text}
                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Link>
      ),
    }}
  />
  <Tabs.Screen
    name="gastos"
    options={{
      title: 'Gastos',
      headerShown: false, // Si deseas ocultar el header en esta pantalla
      tabBarIcon: ({ color }) => <MaterialIcons name="attach-money" size={24} color={color} />,
      
    }}
  />
  <Tabs.Screen
    name="documentos"
    options={{
      title: 'Documentos',
      tabBarIcon: ({ color }) => <TabBarIcon name="child" color={color} />,
      headerStyle: {
        backgroundColor: '#96ac60', // Color de fondo del header
      },
      headerTintColor: '#fff'
    }}
  />
  <Tabs.Screen
    name="iniciarSesion"
    options={{
      title: 'Perfil',
      tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
      headerStyle: {
        backgroundColor: '#96ac60', // Color de fondo del header
      },
      headerTintColor: '#fff'
    }}
  />
  
</Tabs>

  );
}

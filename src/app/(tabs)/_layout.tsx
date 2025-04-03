import React from "react";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/src/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.verde.verdeNormal,
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: Colors.verde.verdeOscuro,
          height: 53,
          paddingBottom: 5,
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="calendarios"
        options={{
          title: "Planning",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="eventos"
        options={{
          title: "Eventos",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="schedule" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: "Gastos",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" color={color} size={24} />
          ),
          headerShown: false,
          headerStyle: {
            backgroundColor: "#96ac60",
          },
          headerTintColor: "#fff",
        }}
      />
    </Tabs>
  );
}

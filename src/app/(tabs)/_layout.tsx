import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "@/src/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

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
          title: "Calendario",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
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
        name="DocumentosScreen"
        options={{
          title: "Documentos",
          tabBarIcon: ({ color }) => <TabBarIcon name="child" color={color} />,
          headerStyle: {
            backgroundColor: "#96ac60",
          },
          headerTintColor: "#fff",
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
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

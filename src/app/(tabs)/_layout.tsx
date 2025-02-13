import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#586e26",
        tabBarInactiveTintColor: "#ffff",
        tabBarStyle: {
          backgroundColor: "#96ac60",
          height: 53,
          paddingBottom: 5,
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
          headerStyle: {
            backgroundColor: "#96ac60",
          },
          headerTintColor: "#fff",
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
        name="documentos"
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
          headerStyle: {
            backgroundColor: "#96ac60",
          },
          headerTintColor: "#fff",
        }}
      />
    </Tabs>
  );
}

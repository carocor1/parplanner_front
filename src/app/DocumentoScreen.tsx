import { router, useFocusEffect } from "expo-router";
import { Text, View, ScrollView} from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Planning } from "../interfaces/PlanningInterface";
import { getProgenitorIdFromToken } from "../utils/storage";
import { getPlanningsByProgenitor } from "../services/planningService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Colors from "../constants/Colors";

import PlanningItem from "../components/PlanningItem";

export default function DocumentoScreen() {
  const [listaPlannings, setListaPlannings] = useState<Planning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progenitorLogueadoId, setProgenitorLogueadoId] = useState<number | null>(null);

  const fetchPlannings = async () => {
    setLoading(true);
    try {
      const id = await getProgenitorIdFromToken();
      if (id) {
        setProgenitorLogueadoId(id);
      }
      const plannings = await getPlanningsByProgenitor();
      setListaPlannings(plannings);
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error al recuperar los plannings. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlannings();
    }, [])
  );

  if (loading) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.ParteSuperiorContainer}>
          {listaPlannings.length > 0 ? (
            <>
              <Text style={styles.noDebeText}>Tenés nuevos plannings</Text>
              <View style={styles.PlanningsContainer}>
                <Text style={styles.planningsTitle}>Plannings</Text>
                {progenitorLogueadoId &&
                  listaPlannings.map((planning) => (
                    <PlanningItem
                      key={planning.id}
                      planning={planning}
                      usuarioLogueadoId={progenitorLogueadoId}
                      onRecargar={fetchPlannings}
                    />
                  ))}
              </View>
            </>
          ) : (
            <Text style={styles.textoSinGasto}>
              ¡Registrá un nuevo Planning para comenzar!
            </Text>
          )}
        </View>
      </ScrollView>

 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  ParteSuperiorContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6A5ACD",
    paddingBottom: 90,
    paddingTop: 60,
    width: "100%",
  },
  debeText: {
    color: Colors.lila.lilaMuyClaro,
    fontSize: 16,
  },
  noDebeText: {
    color: Colors.lila.lilaMuyClaro,
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 60,
    textAlign: "center",
    lineHeight: 34,
    paddingVertical: 18,
  },
  PlanningsContainer: {
    marginTop: -65,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
    zIndex: 1,
    width: "92%",
    alignSelf: "center",
  },
  planningsTitle: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textoSinGasto: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    color: "gray",
    lineHeight: 30,
    paddingHorizontal: 50,
    paddingVertical: 200,
  },
  botonFlotante: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#778c43",
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

import React from "react";
import { useEffect, useState } from "react";
import { getPlanningById } from "@/src/services/planningService";
import { Planning } from "@/src/interfaces/PlanningInterface";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useLocalSearchParams } from "expo-router";
import { View,Text,StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";
import CalendarioPlanning from "@/src/components/CalendarioPlanningDef";


const DetallePlanningScreen: React.FC=()=>{


    
    const { id, usuarioId } = useLocalSearchParams();
    const parsedPlanningId = id ? Number(id) : null;
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [planning, setPlanning]= useState<Planning| null>(null);
    const usuarioLogueadoId = usuarioId ? Number(usuarioId) : null; 
    const [fechasAsignadasCreador, setFechasAsignadasCreador] = useState<string[]>([]);
    const [fechasAsignadasParticipe, setFechasAsignadasParticipe] = useState<string[]>([]);


    const fetchPlanning = async () => {
        try {
          if (parsedPlanningId) {
            setLoading(true);
            const planning = await getPlanningById(parsedPlanningId);
            if (!planning) {
              throw new Error("Planning no encontrado");
            } else {
              setPlanning(planning);
            }
          }
        } catch (error) {
          console.error("Error al cargar el gasto:", error);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlanning();
    }, [parsedPlanningId]);

    if (loading) {
        return <LoadingIndicator />;
    }; 

    
    if (!planning){
        return <Text>Planning no disponible</Text>
    }
    

   
    const esPendiente = planning.estado.id === 7;
    const esAprobado = planning.estado.id === 8;
    const esCreador= planning.usuario_creador.id === usuarioLogueadoId;

    const fechaFormateada = planning?.fechaInicio
    ? new Date(planning.fechaInicio).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Fecha no disponible";



    return(
        <View style={styles.container}>
            <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>PLANNING PROPUESTO</Text>
            </View>
            <View style={styles.contenedorPlanning}>

                <View style={( esPendiente? styles.rectanguloPendiente: styles.rectanguloAprobada)}>
                    <Text style={esPendiente? styles.textoPendiente: styles.textoAprobado}> {planning.estado.nombre.toUpperCase()}
                    </Text>
                </View>
                

                {(esCreador) &&(<View style={styles.containerPlanning}>
                    <Text style={styles.textoPlanning}>PROPONÉS LA SIGUIENTE PLANIFICACIÓN</Text>
                </View>)}
                
                { (!esCreador)&& (<View style={styles.containerPlanning}>
                    <Text style={styles.textoPlanning}>{planning.usuario_creador.nombre.toUpperCase()} PROPONE LA SIGUIENTE PLANIFICACIÓN</Text>
                </View>)} 

                <View style={styles.fechasAsignadasContainer}>
                    <View style={styles.rectanguloCreador}>
                            <Text style={styles.textoCreador}>
                                {esCreador? `${planning.usuario_creador.nombre.toUpperCase()} (Vos)`: planning.usuario_creador.nombre.toUpperCase()} 
                            </Text>
                        </View>
                        <View style={styles.rectanguloParticipe}>
                            <Text style={styles.textoParticipe}>
                                {esCreador? planning.usuario_participe.nombre.toUpperCase() : `${planning.usuario_participe.nombre.toUpperCase()} (Vos)`} 
                            </Text>
                    </View>

                </View> 
                <CalendarioPlanning fechasAsignadasCreador={planning.fechasAsignadasCreador} fechasAsignadasParticipe={planning.fechasAsignadasParticipe}></CalendarioPlanning>
  
            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#fff"
    },
    tituloLabel: {
        fontSize: 18,
        color: "#666",
        alignSelf: "center",
        marginTop: 10,
    },
    errorText: {
        alignSelf: "center",
        fontSize: 18,
        color: "red",
    },
    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10,
        textAlign: "center",
        color: Colors.rosa.rosaOscuro,
       
    },
    descripcion: {
        fontSize: 18,
        color: "#666",
        alignSelf: "center",
        textAlign: "center",
    },
    rectanguloPendiente: {
        backgroundColor: "#FFE5B4",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 15,
        alignSelf: "center",
        marginTop:5,
        
    },
    textoPendiente: {
        color: "#cd8d0d",
        fontWeight: "bold",
        fontSize: 25,
    },
    rectanguloAprobada: {
        backgroundColor: "#ccdaed",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 15,
        alignSelf: "center",
        marginTop:0,
      
    },
    textoAprobado: {
        color: "#5f80ad",
        fontWeight: "bold",
        fontSize: 25,
    },
    contenedorPlanning: {
        marginTop: 10,
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 30,
        marginBottom: 60,
    },
    containerPlanning: {
        backgroundColor: Colors.marron.marronClaro,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom:10, 
        width: "100%", 
    },
    textoPlanning: {
        color: Colors.marron.marronNormal,
        fontWeight: "bold",
        fontSize:16, 
        textAlign:"center"
    },
    containerTitulo: {
        backgroundColor: Colors.rosa.rosaPetitte,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        alignItems: "center",
        height: "16%",
        width: "100%",
        padding: 10,
        justifyContent:"center"
    },
    rectanguloCreador: {
        backgroundColor: Colors.naranja.naranjaClaro,
        padding: 5,
        borderRadius: 10,
    },
      textoCreador: {
        color: Colors.naranja.naranjaOscuro,
        fontWeight: "bold",
    },
      rectanguloParticipe: {
        backgroundColor: Colors.lila.lilaClaro,
        padding: 5,
        borderRadius: 10,
        justifyContent:"center"
    },
      textoParticipe: {
        color: Colors.lila.lilaNormal,
        fontWeight: "bold",
    },
    fechasAsignadasContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom:0,
    },
});

export default DetallePlanningScreen;
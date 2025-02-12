import AsyncStorage from "@react-native-async-storage/async-storage";

export const guardarToken = async (token) => {
  try {
    await AsyncStorage.setItem("access_token", token);
  } catch (error) {}
};

export const obtenerToken = async () => {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (error) {
    return null;
  }
};

export const eliminarToken = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
  } catch (error) {}
};

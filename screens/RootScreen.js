import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RootScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    checkUserRole();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const checkUserRole = async () => {
    try {
      // Ambil cookie token dan role dari AsyncStorage
      const token = await AsyncStorage.getItem(
        "token"
      );
      const role = await AsyncStorage.getItem(
        "role"
      );

      if (token && role) {
        if (role === "user") {
          navigation.navigate("Home");
        } else if (role === "admin") {
          navigation.navigate("Dashboard");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      // Handle kesalahan jika terjadi masalah saat mengambil token dan role
      console.error(
        "Error checking user role:",
        error
      );
    }
  };

  return (
    <View>
      <Text>RootScreen</Text>
    </View>
  );
};

export default RootScreen;

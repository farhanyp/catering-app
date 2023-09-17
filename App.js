import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from "./screens/HomeScreen";
import RootScreen from "./screens/RootScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DashboardScreen from "./screens/DashboardScreen";
import FoodScreen from "./screens/FoodScreen"
import DrinkScreen from "./screens/DrinkScreen";
import DetailPackageCard from "./components/DetailPackageCard";
import DetailFoodCard from "./components/DetailFoodCard";
import DetailDrinkCard from "./components/DetailDrinkCard";
import PackageScreen from "./screens/PackageScreen";
import BankScreen from "./screens/BankScreen";
import OrderScreen from "./screens/OrderScreen";
import HistoryScreen from "./screens/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Root"
            component={RootScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
          />
          <Stack.Screen
            name="DetailPackage"
            component={DetailPackageCard}
          />
          <Stack.Screen
            name="DetailFood"
            component={DetailFoodCard}
          />
          <Stack.Screen
            name="DetailDrink"
            component={DetailDrinkCard}
          />
          <Stack.Screen
            name="FoodScreen"
            component={FoodScreen}
          />
          <Stack.Screen
            name="DrinkScreen"
            component={DrinkScreen}
          />
          <Stack.Screen
            name="PackageScreen"
            component={PackageScreen}
          />
          <Stack.Screen
            name="OrderScreen"
            component={OrderScreen}
          />
          <Stack.Screen
            name="BankScreen"
            component={BankScreen}
          /><Stack.Screen
            name="HistoryScreen"
            component={HistoryScreen}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
import React, {
  useState,
  useLayoutEffect,
} from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from 'react-native-chart-kit';
import PowerIcon from "../assets/power.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderChart from "../components/OrderChart"
import axios from "axios";

const DashboardScreen = ({ navigation }) => {
  const [orderData, setOrderData] = useState([]);
  const [ token, setToken] = useState("")
  const [dataFetched, setDataFetched] = useState(false);

  useLayoutEffect(() => {
    checkUserAccess();
    if (orderData.length === 0 && token !== "") {
      fetchOrderData()
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [dataFetched, token, orderData]);

  const checkUserAccess = async () => {
    try {
      const token = await AsyncStorage.getItem(
        "token"
      );
      const role = await AsyncStorage.getItem(
        "role"
      );

      setToken(token)

      // if (!token || !role) {
      //   navigation.navigate("Login");
      // } else if (role !== "user") {
      //   navigation.navigate("Dashboard");
      // }
    } catch (error) {
      console.error(
        "Error checking user access:",
        error
      );
    }
  };

  const fetchOrderData = async () => {
    try {
      if (orderData.length === 0) {
        const response = await axios.get('https://backend-chatering-online.vercel.app/api/v1/admin/order', {
          headers: {
            'Authorization': `${token}`,
          },
        });
        if(response.data){
          setOrderData(response.data.data);
          setDataFetched(true);
        }
      }

    } catch (error) {
      console.error('Error fetching order data:', error.response.data.errors);
    }
  };

  const handleLogout = async () => {
    try {
      // Hapus token dan role dari AsyncStorage saat logout
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");

      // Arahkan pengguna ke layar login setelah logout
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <SafeAreaView>
      <View className="pt-3 bg-white">
        {/* headers */}

        <View className="flex-row items-center mx-4 space-x-2">
          <View className="flex-1">
            <Text className="font-bold text-xl">
              Dashboard Catering Online
            </Text>
          </View>

          <TouchableOpacity>
            <PowerIcon
              width={25}
              height={25}
              onPress={handleLogout}
            />
          </TouchableOpacity>
        </View>

          <ScrollView
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            showsHorizontalScrollIndicator={false}
            className="pt-4"
          >

          <View className="flex-row pb-3 gap-3">
          <TouchableOpacity
            className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
            onPress={() =>
              navigation.navigate("Dashboard")
            }
          >
            <Text className="text-white">
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
            onPress={() =>
              navigation.navigate("FoodScreen")
            }
          >
            <Text className="text-white">
              Food
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
            onPress={() =>
              navigation.navigate("DrinkScreen")
            }
          >
            <Text className="text-white">
              Drink
            </Text>
          </TouchableOpacity>

          
          <TouchableOpacity
            className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
            onPress={() =>
              navigation.navigate("PackageScreen")
            }
          >
            <Text className="text-white">
              Packages
            </Text>
          </TouchableOpacity>

          
          <TouchableOpacity
            className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
            onPress={() =>
              navigation.navigate("OrderScreen")
            }
          >
            <Text className="text-white">
              Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
            onPress={() =>
              navigation.navigate("BankScreen")
            }
          >
            <Text className="text-white">
              Bank
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
      <View className="pb-56">
        {orderData.length === 0 ? (
          <ActivityIndicator size="large"/>
        ) : (
          <OrderChart orders={orderData}/>
          )
        }
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

import React, {useLayoutEffect, useState} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ShowOrder from './CrudFood/ShowOrder';

const OrderScreen = ({navigation}) => {
  const [orderData, setOrderData] = useState([]);
  const [token, setToken] = useState("")
  const [dataFetched, setDataFetched] = useState(false);
  const [layer, setLayer] = useState("show")

  useLayoutEffect(() => {
    getTokenCookie();
    if (orderData.length === 0 && token !== "") {
      getAPIPackages()
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [layer, dataFetched, orderData, token]);

  const getTokenCookie = async () => {
      const token = await AsyncStorage.getItem(
        "token"
      );
      const role = await AsyncStorage.getItem(
        "role"
      );

      setToken(token)
  };

    const getAPIPackages = async () => {
      if (orderData.length === 0) {
        const response = await axios.get(
          "https://backend-chatering-online.vercel.app/api/v1/admin/order",{
            headers:{
                "Authorization": `${token}`,
                "Content-Type": "multipart/form-data"
              }
          }
        );
        if(response.data.data){
          setOrderData(response.data.data);
          setDataFetched(true);
        }
      }
    };

    return (
      <SafeAreaView>
        <View className="pt-3 bg-white">
          {/* headers */}

          <View className="flex-row items-center mx-4 space-x-2">
            <View className="flex-1">
              <Text className="font-bold text-xl">
                Order - Molana Catering
              </Text>
            </View>
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
                Makanan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
              onPress={() =>
                navigation.navigate("DrinkScreen")
              }
            >
              <Text className="text-white">
                Minuman
              </Text>
            </TouchableOpacity>

            
            <TouchableOpacity
              className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
              onPress={() =>
                navigation.navigate("PackageScreen")
              }
            >
              <Text className="text-white">
                Paketan
              </Text>
            </TouchableOpacity>

            
            <TouchableOpacity
              className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
              onPress={() =>
                navigation.navigate("OrderScreen")
              }
            >
              <Text className="text-white">
                Pesanan
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

      <View>
        <ShowOrder navigation={navigation} orders={orderData} token={token}/>
      </View>

    </SafeAreaView>
    );
}

export default OrderScreen;

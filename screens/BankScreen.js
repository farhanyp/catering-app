import React, {useLayoutEffect, useState} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ShowFood from './CrudFood/ShowFood';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ShowBank from './CrudFood/ShowBank';

const BankScreen = ({navigation}) => {
  const [bankData, setBankData] = useState([]);
  const [token, setToken] = useState("")
  const [dataFetched, setDataFetched] = useState(false);
  const [layer, setLayer] = useState("show")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [noRek, setNoRek] = useState("");
  const [nameBank, setNameBank] = useState("");

  useLayoutEffect(() => {
    getTokenCookie();
    if (bankData.length === 0 && token !== "") {
      getAPIBanks()
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [layer, dataFetched,bankData, token]);

  const getTokenCookie = async () => {
      const token = await AsyncStorage.getItem(
        "token"
      );
      const role = await AsyncStorage.getItem(
        "role"
      );

      setToken(token)
  };

    const getAPIBanks = async () => {
      if (bankData.length === 0) {
        const response = await axios.get(
          "https://backend-chatering-online.vercel.app/api/v1/member/bank"
        );
        if(response.data.data){
            setBankData(response.data.data);
            setDataFetched(true);
        }
      }
    };

    const postOrderData = async () => {

      try {
        setLoading(true);
        
        const response = await axios.post("https://backend-chatering-online.vercel.app/api/v1/admin/bank/create", {
            name: name,
            noRek: noRek,
            nameBank: nameBank
        } ,{
          headers:{
            "Authorization": `${token}`
          }
        }
        );

        Alert.alert(
          "Berhasil!",
          `${name} berhasil ditambahkan`
        );
      setLoading(false);
      setIsModalVisible(false)
      navigation.navigate("BankScreen");
      } catch (error){
        console.log(error.response.data)
        if (error.response) {
          Alert.alert(
            "Kesalahan Login",
            error.response.data.message
          );
        }
        setLoading(false);
      }
    };

    return (
      <SafeAreaView>
        <View className="pt-3 bg-white">
          {/* headers */}

          <View className="flex-row items-center mx-4 space-x-2">
            <View className="flex-1">
              <Text className="font-bold text-xl">
                Bank  - Molana Catering
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

          <View className="flex justify-center items-center">
            <View className="flex-row pb-3 gap-3">
            <TouchableOpacity
              className=" bg-blue-500 w-20 h-10 rounded items-center justify-center"
              onPress={()=>{
                setIsModalVisible(true)
              }}
            >
              <Text className="text-white">
                Buat Data
              </Text>
            </TouchableOpacity>

            </View>
        </View>
      </View>

      <Modal visible={isModalVisible} animationType="slide">
      <View className="flex-1 px-3 text-black">
              <View className="flex justify-end items-end">
              <TouchableOpacity
                  className=" bg-gray-500 w-10 h-10 rounded justify-center items-center"
                  onPress={() => setIsModalVisible(false)}
                  >
                  <Text className="text-white font-bold text-xl">X</Text>
              </TouchableOpacity>
              </View>
              <View className="flex justify-center items-center">
              <Text className="text-3xl font-bold pb-4">Bank:</Text>
              </View>
              <TextInput
              className="w-full h-12 border rounded p-2 mb-2"
              placeholder="Nama"
              onChangeText={(text) => setName(text)}
              value={name}
              />
              <TextInput
              className="w-full h-12 border rounded p-2 mb-2"
              placeholder="Nomor Rekening"
              onChangeText={(text) => setNoRek(text)}
              value={noRek}
              />
              <TextInput
              className="w-full h-12 border rounded p-2 mb-2"
              placeholder="Nama Bank"
              onChangeText={(text) => setNameBank(text)}
              value={nameBank}
              />

              <TouchableOpacity
              className="w-full h-12 bg-blue-500 rounded items-center justify-center"
              onPress={postOrderData}
              >
              <Text className="text-white text-lg">
              {loading ? (
              <ActivityIndicator
                  animating={loading}
                  size="large"
              />
              ) : (
              "Buat Data"
              )}
          </Text>
          </TouchableOpacity>
          </View>
      </Modal>

      <View>
        <ShowBank navigation={navigation} banks={bankData} token={token}/>
      </View>

    </SafeAreaView>
    );
}

export default BankScreen;

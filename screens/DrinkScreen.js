import React, {useLayoutEffect, useState} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ShowDrink from './CrudFood/ShowDrink';

const DrinkScreen = ({navigation}) => {
  const [drinkData, setDrinkData] = useState([]);
  const [token, setToken] = useState("")
  const [dataFetched, setDataFetched] = useState(false);
  const [layer, setLayer] = useState("show")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imageFormat, setImageFormat] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const [canPostData, setCanPostData] = useState(false)

  useLayoutEffect(() => {
    getTokenCookie();
    if (drinkData.length === 0 && token !== "") {
      getAPIPackages()
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [layer, dataFetched, drinkData, token, imageUri, canPostData]);

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
      if (drinkData.length === 0) {
        const response = await axios.get(
          "https://backend-chatering-online.vercel.app/api/v1/member/drink"
        );
        if(response.data){
        setDrinkData(response.data.data);
          setDataFetched(true);
        }
      }
    };

    const postOrderData = async () => {

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('dataImage', {
          uri: imageUri,
          name: `photo.${imageFormat}`,
          type: `${imageType}`,
        });
        formData.append('typeImage', imageType);
        formData.append('name', name);
        formData.append('qty', qty);
        formData.append('price', price);
        formData.append('description', description);
        
        const response = await axios.post("https://backend-chatering-online.vercel.app/api/v1/admin/drink/create", formData ,{
          headers:{
            "Authorization": `${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
        );

      Alert.alert(
        "Berhasil!",
        `${name} berhasil ditambahkan`
      );
      setLoading(false);
      setIsModalVisible(false)
      navigation.navigate("DrinkScreen");
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

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
    
        // Ambil informasi tentang file gambar
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
    
        // Periksa ukuran gambar dalam byte
        const imageSizeInBytes = fileInfo.size;
    
        // Konversi ukuran gambar dari byte ke megabyte
        const imageSizeInMB = imageSizeInBytes / (1024 * 1024);
    
        if (imageSizeInMB > 2) {
          // Ukuran gambar lebih dari 2 MB, tampilkan pesan kesalahan
          Alert.alert('Error', 'Ukuran gambar melebihi 2 MB');
          setCanPostData(false)
        } else {
          // Ukuran gambar valid, lanjutkan dengan pemrosesan gambar
          const imageType = result.assets[0].type;
          const imageFormat = imageUri.split('.').pop();
          const imageTypeAndFormat = `${imageType}/${imageFormat}`;
    
          setImageType(imageTypeAndFormat);
          setImageUri(imageUri);
          setImageFormat(imageFormat);
          setCanPostData(true)
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
                Drink Catering Online
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

          <View className="flex justify-center items-center">
            <View className="flex-row pb-3 gap-3">
            <TouchableOpacity
              className=" bg-blue-500 w-20 h-10 rounded items-center justify-center"
              onPress={()=>{
                setIsModalVisible(true)
              }}
            >
              <Text className="text-white">
                Create
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
          <Text className="text-3xl font-bold pb-4">Drink:</Text>
          </View>
          <TextInput
            className="w-full h-12 border rounded p-2 mb-2"
            placeholder="Nama"
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <TextInput
            className="w-full h-12 border rounded p-2 mb-2"
            placeholder="Jumlah"
            onChangeText={(numeric) => setQty(numeric)}
            value={qty}
            inputMode='numeric'
          />
          <TextInput
            className="w-full h-12 border rounded p-2 mb-2"
            placeholder="Harga"
            onChangeText={(numeric) => setPrice(numeric)}
            value={price}
            inputMode='numeric'
          />
          <TextInput
            className="w-full h-12 border rounded p-2 mb-2"
            placeholder="Deskripsi"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginVertical: 10 }}
              onPress={pickImage}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Pilih Gambar</Text>
            </TouchableOpacity>
            
            {
              canPostData ? 
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
                "Pesan"
              )}
            </Text>
          </TouchableOpacity>
          :
          null
            }

        </View>
      </Modal>

      <View>
        <ShowDrink imageUri={imageUri} navigation={navigation} drinks={drinkData} token={token}/>
      </View>

    </SafeAreaView>
    );
}

export default DrinkScreen;

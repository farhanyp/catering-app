import React, { useLayoutEffect, useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ShowPackage from './CrudFood/ShowPackage';
import DropDownPicker from 'react-native-dropdown-picker';
import {useForm, Controller} from 'react-hook-form';


const PackageScreen = ({ navigation }) => {
  const [packageData, setPackageData] = useState([]);
  const [token, setToken] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [layer, setLayer] = useState("show")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imageFormat, setImageFormat] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState();
  const [foodData, setFoodData] = useState([]);
  const [drinkData, setDrinkData] = useState([]);
  const [foodId, setFoodId] = useState('');
  const [drinkId, setDrinkId] = useState('');
  const [canPostData, setCanPostData] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);
  const [drinkOpen, setDrinkOpen] = useState(false);
  const [drinkValue, setDrinkValue] = useState(null);
  const [foodValue, setFoodValue] = useState(null);
  const [company, setCompany] = useState([
    { label: "PUCIT", value: "pucit" },
    { label: "UCP", value: "ucp" },~
    { label: "UET", value: "uet" },
  ]);
  const { handleSubmit, control } = useForm();

  useLayoutEffect(() => {
    getTokenCookie();
    if (packageData.length === 0 && token !== "") {
      getAPIPackages();
    }
    if (foodData.length === 0 && drinkData.length === 0) {
      getFoodData();
      getDrinkData();
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [layer, dataFetched, packageData, token, imageUri, canPostData]);

  const getFoodData = async () => {
    try {
      if (foodData.length === 0) {
        const response = await axios.get(
          'https://backend-chatering-online.vercel.app/api/v1/member/food'
        );
        if (response.data) {
          setFoodData(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  const getDrinkData = async () => {
    try {
      if (drinkData.length === 0) {
        const response = await axios.get(
          'https://backend-chatering-online.vercel.app/api/v1/member/drink'
        );
        if (response.data) {
          setDrinkData(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching drink data:', error);
    }
  };

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
    try{
      if (packageData.length === 0) {
        const response = await axios.get(
          "https://backend-chatering-online.vercel.app/api/v1/member/package"
        );
        if (response.data) {
          setPackageData(response.data.data);
          setDataFetched(true);
        }
      }
    }catch(error){
      console.log(error.response.data)
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
      formData.append('foodId', foodId);
      formData.append('drinkId', drinkId);
      formData.append('price', 1000);
      formData.append('discount', discount);
      formData.append('description', description);

      const response = await axios.post("https://backend-chatering-online.vercel.app/api/v1/admin/package/create", formData, {
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "multipart/form-data",
        }
      });

      Alert.alert(
        "Berhasil!",
        `${name} berhasil ditambahkan`
      );
      setLoading(false);
      setIsModalVisible(false)
      navigation.navigate("PackageScreen");
    } catch (error) {
      if (error.response.data.errors) {
        Alert.alert(
          "Berhasil !!",
          error.response.data.errors
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
        setCanPostData(false);
      } else {
        // Ukuran gambar valid, lanjutkan dengan pemrosesan gambar
        const imageType = result.assets[0].type;
        const imageFormat = imageUri.split('.').pop();
        const imageTypeAndFormat = `${imageType}/${imageFormat}`;

        setImageType(imageTypeAndFormat);
        setImageUri(imageUri);
        setImageFormat(imageFormat);
        setCanPostData(true);
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
              Package Catering Online
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
              onPress={() => {
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
          <Text className="text-3xl font-bold pb-4">Package:</Text>
        </View>
        <TextInput
          className="w-full h-12 border rounded p-2 mb-2"
          placeholder="Nama"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          className="w-full h-12 border rounded p-2 mb-2"
          placeholder="Deskripsi"
          onChangeText={(text) => setDescription(text)}
          value={description}
        />
        
        <TextInput
          className="w-full h-12 border rounded p-2 mb-2"
          placeholder="Potongan Harga:"
          onChangeText={(numberic) => setDiscount(numberic)}
          inputMode='numeric'
          value={discount}
        />

        <TouchableOpacity
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginVertical: 10 }}
          onPress={pickImage}
        >
          <Text className="text-white font-bold">Pilih Gambar</Text>
        </TouchableOpacity>

        <View className="flex-row gap-1">
          <View className="w-1/2">
            <Text style={{ color: "black", fontWeight: "bold" }}>Pilih Makanan</Text>
            <Controller
              name="Food"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={foodOpen ? { marginBottom:  180 } : {marginBottom:  30}}>
                  <DropDownPicker
                    containerStyle={{ height: 40 }}
                    open={foodOpen}
                    value={foodValue}
                    items={foodData.map((food) => ({ label: food.name, value: food._id }))}
                    setOpen={setFoodOpen}
                    setValue={setFoodValue}
                    placeholder="Pilih Makanan"
                    placeholderStyle={{ color: "grey" }}
                    loading={loading}
                    activityIndicatorColor="#5188E3"
                    onChangeValue={(label) => setFoodId(label)}
                    zIndex={1000}
                    zIndexInverse={3000}
                  />
                </View>
              )}
            />
          </View>

          <View className="w-1/2">
            <Text className="text-black font-bold">Pilih Minuman</Text>
              <Controller
              name="Drink"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View className="mb-[15px]">
                  <DropDownPicker
                    className="h-12 border rounded"
                    open={drinkOpen}
                    value={drinkValue}
                    items={drinkData.map((drink) =>  ({ label: drink.name, value: drink._id }))}
                    setOpen={setDrinkOpen}
                    setValue={setDrinkValue}
                    placeholder="Pilih Minuman"
                    placeholderStyle={{ color: "grey" }}
                    loading={loading}
                    activityIndicatorColor="#5188E3"
                    onChangeValue={(label) => setDrinkId(label)}
                    zIndex={1000}
                    zIndexInverse={3000}
                  />
                </View>
              )}
            />
          </View>
        </View>
      
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
        <ShowPackage imageUri={imageUri} navigation={navigation} packages={packageData} token={token} />
      </View>
    </SafeAreaView>
  );
}

export default PackageScreen;

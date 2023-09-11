import React, {
  useState,
  useLayoutEffect,
} from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator, TextInput } from "react-native";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DetailFoodCard = ({ route, navigation }) => {
  const { data } = route.params;
  const [bankData, setBankData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imageFormat, setImageFormat] = useState(null);
  const [count, setCount] = useState(1);
  const [priceTotal, setPriceTotal] = useState(0);
  const [canPostData, setCanPostData] = useState(false)
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    getPriceTotal()
  }, [navigation, count, priceTotal,isModalVisible]);

  const getPriceTotal = () => {
    if(data.price &&  count !== 0){
      setPriceTotal(count * data.price)
    }
  }

  const IncPackageQty = () => {
    
    if(count < data.qty){
      setCount(prevCount => prevCount + 1)
    }
  }

  const DescPackageQty = () => {
    if(count > 1 ){
      setCount(count - 1)
    }
  }

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

  const fetchBankData = async () => {
    try {
      const response = await axios.get('https://backend-chatering-online.vercel.app/api/v1/member/bank');
      const data = response.data.data;
      setBankData(data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching bank data: ', error);
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
        formData.append('address', address);
        formData.append('phone', phone);
        formData.append('qtyFood', count);
        formData.append('foodId', data._id);
        formData.append('totalPrice', priceTotal);

      const response = await axios.post(
        "https://backend-chatering-online.vercel.app/api/v1/member/order", formData ,{
          headers:{
            "Content-Type": "multipart/form-data"
          }
        }
        );

      Alert.alert(
        "Berhasil!",
        `${data.name} berhasil dipesan`
      );
      setLoading(false);
      setIsModalVisible(false)
      navigation.navigate("Home");
    } catch (error){
      console.log(error.response.data)
      if (error.response) {
        Alert.alert(
          "Kesalahan Login",
          error.response.data.errors
        );
      }
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="bg-gray-100"
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
      <View className="flex-1 items-center">
        <Text className="font-bold text-2xl mb-4">
        Makanan
        </Text>

        <Image
          source={{
            uri: `data:${data.typeImage};base64,${data.dataImage}`,
          }}
          style={{
            width: 200,
            height: 200,
            marginBottom: 10,
          }}
        />

        <Text className="font-bold text-lg mb-1">
          Nama Makanan:
        </Text>
        <Text className="text-lg mb-4">
          {data.name}
        </Text>

        <Text className="font-bold text-lg mb-1">
          Deskripsi:
        </Text>
        <Text className="text-lg mb-1">
          {data.description}
        </Text>
        
        <Text className="font-bold text-lg mb-1 pt-5">
          harga:
        </Text>
        <Text className="text-lg mb-4">
          {data.price.toLocaleString("id-ID")}
        </Text>

        <View className="flex-row-reverse justify-center items-center">
            <View className="flex-col justify-center items-center w-52">
              <Text className="font-bold text-lg mb-1 pt-5">
                Total harga:
              </Text>
              <Text className="text-lg mb-4">
                {priceTotal.toLocaleString("id-ID")}
              </Text>
            </View>
            <View className="flex-row justify-center items-center w-52">
              <TouchableOpacity className="bg-blue-500 w-8 h-8 rounded items-center justify-center mr-5" onPress={DescPackageQty}>
                <Text className="text-white font-bold text-3xl">-</Text>
              </TouchableOpacity>
              <View>
                <Text className="font-bold text-lg mb-1">QTY:</Text>
                <Text className="text-center font-semibold text-lg mb-1">{count}</Text>
              </View>
              <TouchableOpacity className="bg-blue-500 w-8 h-8 rounded items-center justify-center ml-5" onPress={IncPackageQty}>
              <Text className="text-white font-bold text-3xl">+</Text>
            </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="bg-blue-500 w-36 h-12 mt-10 rounded items-center justify-center" onPress={fetchBankData}>
              <Text className="text-white font-bold text-xl">Pesan</Text>
          </TouchableOpacity>

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
                <Text className="text-3xl font-bold pb-4">Makan:</Text>
                </View>
                <View className="flex-row gap-3 items-center justify-center pb-5">
                  {/* Tampilkan data bank */}
                  {bankData.map((bank) => (
                    <View key={bank._id} className="grid-cols-3 justify-center p-3 shadow w-40 bg-slate-300">
                      <Text className="font-semibold text-base">Nama: {bank.name}</Text>
                      <Text className="font-semibold text-base">No. Rekening: {bank.noRek}</Text>
                      <Text className="font-semibold text-base">Nama Bank: {bank.nameBank}</Text>
                    </View>
                  ))}
                </View>
                <TextInput
                  className="w-full h-12 border rounded p-2 mb-2"
                  placeholder="Nama"
                  onChangeText={(text) => setName(text)}
                  value={name}
                />
                <TextInput
                  className="w-full h-12 border rounded p-2 mb-2"
                  placeholder="Alamat"
                  onChangeText={(text) => setAddress(text)}
                  value={address}
                />
                <TextInput
                  className="w-full h-12 border rounded p-2 mb-2"
                  placeholder="Nomor HP"
                  onChangeText={(text) => setPhone(text)}
                  value={phone}
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


      </View>
    </ScrollView>
  );
};

export default DetailFoodCard;

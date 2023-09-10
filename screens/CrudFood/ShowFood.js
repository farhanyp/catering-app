import React, {useLayoutEffect, useState} from 'react';
import { Avatar, Button, Card, Text, BottomNavigation } from 'react-native-paper';
import { View, Image, ActivityIndicator, Alert, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ShowFood = ({navigation, foods, token}) => {
    const [isLoading , setIsLoading] = useState(true)
    const [loading, setLoading] = useState(false);
    const [dataAvailable, setDataAvailable] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageType, setImageType] = useState(null);
    const [imageFormat, setImageFormat] = useState(null);
    const [FoodId, setFoodId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState();
    const [price, setPrice] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    useLayoutEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (foods && foods.length > 0) {
            setDataAvailable(true);
          }
        }, 6000);
      }, [foods, name, qty, price, description]);

    const deleteCard = async(id)=>{
        try{
            const response = await axios.delete(`https://backend-chatering-online.vercel.app/api/v1/admin/food/${id}`,{
                headers: {
                    'Authorization': `${token}`,
                  },
            })
            Alert.alert("Berhasil!", response.data.data)
            navigation.navigate("FoodScreen")
        }catch(error){
            if (error.response.data.errors) {
                Alert.alert(
                  "Berhasil !!",
                  error.response.data.errors
                );
            }
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
    
    const updateOrderData = async () => {
        try {
          setLoading(true);
          const formData = new FormData();

          if( imageUri !== null && imageFormat !== null ){
            formData.append('dataImage', {
              uri: imageUri,
              name: `photo.${imageFormat}`,
              type: `${imageType}`,
            })
          }

          if( imageType !== null ){
            formData.append('typeImage', imageType);
          }

          if( name !== "" ){
            formData.append('name', name);
          }

          if( qty > 0 ){
            formData.append('qty', qty);
          }

          if( price > 0 ){
            formData.append('price', price);
          }

          if( description !== ""){
            formData.append('description', description);
          }

          const response = await axios.patch(`https://backend-chatering-online.vercel.app/api/v1/admin/food/${FoodId}`, formData ,{
            headers:{
              "Authorization": `${token}`,
              "Content-Type": "multipart/form-data",
            }
          }
          );

        Alert.alert(
          "Berhasil!",
          `${name} berhasil diubah`
        );
        setLoading(false);
        setIsModalVisible(false)
        navigation.navigate("FoodScreen");
          
        } catch (error){
          console.log(error.response.data.errors)
          if (error.response.data.errors) {
            Alert.alert(
              "Kesalahan Login",
              error.response.message
            );
          }
          setLoading(false);
        }
      };

    return (
        <ScrollView
        className="bg-gray-100"
        contentContainerStyle={{
            paddingBottom: 400,
        }}
        >
        <View className="flex-col gap-6 px-4 pt-3">
        {
            isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
            ) : dataAvailable ? (
            foods.map((item, index) => {
                return(
                    <Card theme={{ mode: "outlined" }} key={index}>
                        <Card.Content>
                        <Text className="font-bold capitalize text-3xl" variant="titleLarge">{item.name}</Text>
                        <Text variant="bodyMedium">Deskripsi: {item.description}</Text>
                        <Text variant="bodyMedium">Tersedia: {item.qty}</Text>
                        <Text variant="bodyMedium">Harga: {item.price.toLocaleString("id-ID")}</Text>
                        </Card.Content>
                        <Image
                            source={{
                            uri: `data:${item.typeImage};base64,${item.dataImage}`,
                            }}
                            style={{ width: 300, height: 300 }}
                            className="mx-auto mt-4 mb-3 rounded-xl"
                        />
                        <Card.Actions>
                        <Button rippleColor="white" onPress={() => {
                          setSelectedFood(item);
                          setFoodId(item ? item._id : "");
                          setName(item ? item.name : "");
                          setQty(item ? String(item.qty) : "");
                          setPrice(item ? String(item.price) : "");
                          setDescription(item ? item.description : "");
                          setIsModalVisible(true);
                        }}>Update</Button>
                        <Button className="bg-red-500" rippleColor="white" onPress={() => deleteCard(item._id)}>Delete</Button>
                        </Card.Actions>

                        <Modal visible={isModalVisible} animationType="slide">
                            <View className="flex justify-end items-end">
                            <TouchableOpacity
                                    className=" bg-gray-500 w-10 h-10 rounded justify-center items-center"
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Text className="text-white font-bold text-xl">X</Text>
                            </TouchableOpacity>
                            </View>
                            <View className="flex justify-center items-center">
                            <Text className="text-3xl font-bold pb-4">Produk:</Text>
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
                                onChangeText={(numeric) =>setQty(Number(numeric))}
                                inputMode="numeric"
                                value={String(qty)}
                            />
                            <TextInput
                                className="w-full h-12 border rounded p-2 mb-2"
                                placeholder="Harga"
                                onChangeText={(numeric) =>setPrice(Number(numeric))}
                                inputMode="numeric"
                                value={String(price)}
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
                                    <TouchableOpacity
                                      className="w-full h-12 bg-blue-500 rounded items-center justify-center"
                                      onPress={updateOrderData}
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
                        </Modal>

                    </Card>
                )
                })
                ) : (
                <Text>No data available.</Text>
                )}
        </View>

        </ScrollView>
    );
}

export default ShowFood;

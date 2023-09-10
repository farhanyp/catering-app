import React, {useLayoutEffect, useState} from 'react';
import { Avatar, Button, Card, Text, BottomNavigation } from 'react-native-paper';
import { View, Image, ActivityIndicator, Alert, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useForm, Controller} from 'react-hook-form';
import * as FileSystem from 'expo-file-system';

const ShowPackage = ({navigation, packages, token}) => {
    const [isLoading , setIsLoading] = useState(true)
    const [loading, setLoading] = useState(false);
    const [dataAvailable, setDataAvailable] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageType, setImageType] = useState(null);
    const [imageFormat, setImageFormat] = useState(null);
    const [foodData, setFoodData] = useState([]);
    const [drinkData, setDrinkData] = useState([]);
    const [foodId, setFoodId] = useState('');
    const [drinkId, setDrinkId] = useState('');
    const [packageId, setPackageId] = useState('');
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState();
    const [price, setPrice] = useState();
    const [canPostData, setCanPostData] = useState(false)
    const { handleSubmit, control } = useForm();

    useLayoutEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (packages && packages.length > 0) {
            setDataAvailable(true);
          }
          if (foodData.length === 0 && drinkData.length === 0) {
            getFoodData();
            getDrinkData();
          }
        }, 6000);
      }, [packages, name, qty, price, description, canPostData]);


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

    const deleteCard = async(id)=>{
        try{
            const response = await axios.delete(`https://backend-chatering-online.vercel.app/api/v1/admin/package/${id}`,{
                headers: {
                    'Authorization': `${token}`,
                  },
            })
            Alert.alert("Berhasil!", response.data.data)
            navigation.navigate("PackageScreen")
        }catch(error){
            if (error.response.data.errors) {
                Alert.alert(
                  "Berhasil !!",
                  error.response.data.errors
                );
            }
        }
    }

    
    const updateOrderData = async () => {
      try {
        setLoading(true);
        const formData = new FormData();

        if( imageType !== null ){
          formData.append('typeImage', imageType);
        }

        if( name !== "" ){
          formData.append('name', name);
        }
        
        formData.append('price', price);

        if( description !== ""){
          formData.append('description', description);
        }

        if(foodId !== null){
          formData.append('foodId', foodId);
        }

        if(drinkId !== null){
          formData.append('drinkId', drinkId);
        }

        const response = await axios.patch(`https://backend-chatering-online.vercel.app/api/v1/admin/package/${packageId}`, formData ,{
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
      navigation.navigate("PackageScreen");
        
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
              packages.map((item, index) => {
                let no = 0;
                no++;
                return(
                  <Card theme={{ mode: "outlined" }} key={index}>
                  {
                    item.food === null && item.drink === null ?
                    <>
                    <Card.Content>
                          <Text className="font-bold capitalize text-2xl" variant="titleLarge">Nama Paket: {item.package.name}</Text>
                          <Text variant="bodyMedium">Deskripsi: {item.package.description}</Text>
                          <Text variant="bodyMedium">Jenis Pesanan:</Text>
                          {
                            item.food !== null && item.drink !== null ? (
                              <View>
                                <Text variant="bodyMedium">Makanan: {no}. {item.food.name}, tersedia: ({item.food.qty})</Text>
                                <Text variant="bodyMedium">Minuman: {no}. {item.drink.name}, tersedia: ({item.drink.qty})</Text>
                              </View>
                            ) : item.food !== null ? (
                              <View>
                                <Text variant="bodyMedium">Makanan: {no}. ({item.food.name}) ({item.food.qty})</Text>
                              </View>
                            ) : item.drink !== null ? (
                              <View>
                              <Text variant="bodyMedium">Minuman: {index}. Teh Manis ({item.qtyDrink})</Text>
                              </View>
                            ) : null
                          }
                          <Image
                              source={{
                              uri: `data:${item.package.typeImage};base64,${item.package.dataImage}`,
                              }}
                              style={{ width: 300, height: 300 }}
                              className="mx-auto mt-4 mb-3 rounded-xl"
                          />
                          <Text variant="bodyMedium">Harga Original Paket: {(item.food.price + item.drink.price).toLocaleString("id-ID")}</Text>
                          <Text variant="bodyMedium">Potongan Harga: {item.package.discount.toLocaleString("id-ID")}</Text>
                          <Text variant="bodyMedium">Harga Original Paket: {((item.food.price + item.drink.price)-item.package.discount).toLocaleString("id-ID")}</Text>
                        </Card.Content>
                        <Card.Content>
                        <Button className="bg-red-500 mt-4" rippleColor="white" onPress={() => deleteCard(item.package._id)}>
                          <Text className="text-white">Delete</Text>
                        </Button>
                        </Card.Content>
                    </>
                    :
                    <View>
                      <Text  className="text-center">Food atau Drink tidak ada, disarankan untuk menghapus paket</Text>
                      <Button className="bg-red-500 mt-4" rippleColor="white" onPress={() => deleteCard(item.package._id)}>
                          <Text className="text-white">Delete</Text>
                      </Button>
                    </View>
                    
                  }

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

export default ShowPackage;

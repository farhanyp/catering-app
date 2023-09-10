import React, {useLayoutEffect, useState} from 'react';
import { Avatar, Button, Card, Text, BottomNavigation } from 'react-native-paper';
import { View, Image, ActivityIndicator, Alert, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ShowBank = ({navigation, banks, token}) => {
    const [isLoading , setIsLoading] = useState(true)
    const [loading, setLoading] = useState(false);
    const [dataAvailable, setDataAvailable] = useState(false);
    const [BankId, setBankId] = useState("");
    const [name, setName] = useState("");
    const [noRek, setNoRek] = useState("");
    const [nameBank, setNameBank] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [canPostData, setCanPostData] = useState(false)

    useLayoutEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (banks && banks.length > 0) {
            setDataAvailable(true);
          }
        }, 6000);
      }, [banks, name, noRek, nameBank, canPostData]);


    const deleteCard = async(id)=>{
        try{
            const response = await axios.delete(`https://backend-chatering-online.vercel.app/api/v1/admin/bank/${id}`,{
                headers: {
                    'Authorization': `${token}`,
                  },
            })
            Alert.alert(
              "Berhasil!",
              `${name} berhasil dihapus`
            );
            navigation.navigate("BankScreen")
        }catch(error){
          console.log(error.response)
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
          const formData = {};


          if(name !== ""){
            formData.name = name
          }

          if(nameBank !== ""){
            formData.nameBank = nameBank
          }

          if(noRek !== ""){
            formData.noRek = noRek
          }

          const response = await axios.patch(`https://backend-chatering-online.vercel.app/api/v1/admin/bank/${BankId}`, formData ,{
            headers:{
              "Authorization": `${token}`,
            }
          }
          );
        Alert.alert(
          "Berhasil!",
          `${name} berhasil diubah`
        );
        setLoading(false);
        setIsModalVisible(false)
        navigation.navigate("BankScreen");
          
        } catch (error){
          console.log(error)
          // if (error.response.data.errors) {
          //   Alert.alert(
          //     "Kesalahan Login",
          //     error.response.message
          //   );
          // }
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
            banks.map((item, index) => {
                return(
                    <Card theme={{ mode: "outlined" }} key={index}>
                        <Card.Content>
                        <Text className="font-bold capitalize text-lg" variant="titleLarge">Nama Penerima: {item.name}</Text>
                        <Text variant="bodyMedium">Nomor Rekening: {item.noRek}</Text>
                        <Text variant="bodyMedium">Nama Bank: {item.nameBank}</Text>
                        </Card.Content>
                        <Card.Actions>
                        <Button rippleColor="white" onPress={() => {
                          setSelectedFood(item);
                          setBankId(item ? item._id : "");
                          setName(item ? item.name : "");
                          setNoRek(item ? String(item.noRek) : "");
                          setNameBank(item ? String(item.nameBank) : "");
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
                                placeholder="Jumlah"
                                onChangeText={(text) =>setNoRek(text)}
                                value={noRek}
                            />
                            <TextInput
                                className="w-full h-12 border rounded p-2 mb-2"
                                placeholder="Harga"
                                onChangeText={(text) =>setNameBank(text)}
                                value={nameBank}
                            />

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

export default ShowBank;

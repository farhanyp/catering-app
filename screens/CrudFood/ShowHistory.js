import React, {useLayoutEffect, useState} from 'react';
import { Avatar, Button, Card, Text, BottomNavigation } from 'react-native-paper';
import { View, Image, ActivityIndicator, Alert, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const ShowHistory = ({navigation, history, token}) => {
    const [isLoading , setIsLoading] = useState(true)
    const [dataAvailable, setDataAvailable] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState();
    const [price, setPrice] = useState();

    useLayoutEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (history && history.length > 0) {
            setDataAvailable(true);
          }
        }, 6000);
      }, [history, name, qty, price, description]);

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
              history.map((item, index) => {
                let no = 0;
                no++;
                return(
                    <Card theme={{ mode: "outlined" }} key={index}>
                        <Card.Content>
                        <Text className="font-bold capitalize text-base" variant="titleLarge">Nama Pengirim: {item.history.name}</Text>
                        <Text variant="bodyMedium">Alamat: {item.history.address}</Text>
                        <Text variant="bodyMedium">Nomor Hp: {item.history.phone}</Text>
                        <Text variant="bodyMedium">Jenis Pesanan:</Text>
                        {
                          item.history.foodId.length !== 0 && item.history.drinkId.length !== 0 ? (
                            <View>
                              <Text variant="bodyMedium">Makanan: {no}. {item.history.foodId[0].name} ({item.history.qtyFood})</Text>
                              <Text variant="bodyMedium">Minuman: {no}. {item.history.drinkId[0].name} ({item.history.qtyDrink})</Text>
                            </View>
                          ) : item.foodId.length !== 0 ? (
                            <View>
                              <Text variant="bodyMedium">Makanan: {no}. {item.history.foodId[0].name} ({item.history.qtyFood})</Text>
                            </View>
                          ) : item.drinkId.length !== 0 ? (
                            <View>
                            <Text variant="bodyMedium">Minuman: {index}. {item.history.drinkId[0].name} ({item.history.qtyDrink})</Text>
                            </View>
                          ) : null
                        }
                        <Text variant="bodyMedium">Total Harga: {item.history.totalPrice.toLocaleString("id-ID")}</Text>
                        </Card.Content>
                        <Image
                            source={{
                            uri: `data:${item.history.typeImage};base64,${item.history.dataImage}`,
                            }}
                            style={{ width: 300, height: 300 }}
                            className="mx-auto mt-4 mb-3 rounded-xl"
                        />
                        <View className="flex-col justify-center items-center">
                        {
                          item.history.status ? 
                          <Text className="w-full h-10 text-center bg-blue-400 py-1 text-lg text-white font-bold">Pembayaran Berhasil</Text> :
                          <Text className="w-full h-10 text-center bg-red-400 py-1 text-lg text-white font-bold">Pembayaran Tidak Berhasil</Text>

                        }
                        </View>
                    </Card>
                )
                })
                ) : (
                <Text>Tidak ada data yang tersedia.</Text>
                )}
        </View>

        </ScrollView>
    );
}

export default ShowHistory;

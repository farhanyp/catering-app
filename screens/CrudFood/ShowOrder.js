import React, {useLayoutEffect, useState} from 'react';
import { Avatar, Button, Card, Text, BottomNavigation } from 'react-native-paper';
import { View, Image, ActivityIndicator, Alert, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const ShowOrder = ({navigation, orders, token}) => {
    const [isLoading , setIsLoading] = useState(true)
    const [dataAvailable, setDataAvailable] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState();
    const [price, setPrice] = useState();

    useLayoutEffect(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (orders && orders.length > 0) {
            setDataAvailable(true);
          }
        }, 6000);
      }, [orders, name, qty, price, description]);

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
              orders.map((item, index) => {
                let no = 0;
                no++;
                return(
                    <Card theme={{ mode: "outlined" }} key={index}>
                        <Card.Content>
                        <Text className="font-bold capitalize text-base" variant="titleLarge">Nama Pengirim: {item.name}</Text>
                        <Text variant="bodyMedium">Alamat: {item.address}</Text>
                        <Text variant="bodyMedium">Jenis Pesanan:</Text>
                        {
                          item.foodId.length !== 0 && item.drinkId.length !== 0 ? (
                            <View>
                              <Text variant="bodyMedium">Makanan: {no}. Nasi Goreng ({item.qtyFood})</Text>
                              <Text variant="bodyMedium">Minuman: {no}. Teh Manis ({item.qtyDrink})</Text>
                            </View>
                          ) : item.foodId.length !== 0 ? (
                            <View>
                              <Text variant="bodyMedium">Makanan: {no}. Nasi Goreng ({item.qtyFood})</Text>
                            </View>
                          ) : item.drinkId.length !== 0 ? (
                            <View>
                            <Text variant="bodyMedium">Minuman: {index}. Teh Manis ({item.qtyDrink})</Text>
                            </View>
                          ) : null
                        }

                        <Text variant="bodyMedium">Total Harga: {item.totalPrice.toLocaleString("id-ID")}</Text>
                        </Card.Content>
                        <Image
                            source={{
                            uri: `data:${item.typeImage};base64,${item.dataImage}`,
                            }}
                            style={{ width: 300, height: 300 }}
                            className="mx-auto mt-4 mb-3 rounded-xl"
                        />
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

export default ShowOrder;

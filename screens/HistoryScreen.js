import React, {useLayoutEffect, useState} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ShowHistory from './CrudFood/ShowHistory';

const HistoryScreen = ({navigation}) => {
  const [historyData, setHistoryData] = useState([]);
  const [token, setToken] = useState("")
  const [dataFetched, setDataFetched] = useState(false);
  const [layer, setLayer] = useState("show")

  useLayoutEffect(() => {
    getTokenCookie();
    if (historyData.length === 0 && token !== "") {
        getAPIHistory()
    }
    navigation.setOptions({
      headerShown: false,
    });
  }, [layer, dataFetched, historyData, token]);

  const getTokenCookie = async () => {
      const token = await AsyncStorage.getItem(
        "token"
      );
      setToken(token)
  };

    const getAPIHistory = async () => {
      try{
        if(historyData.length === 0){
          const response = await axios.get(
            "https://backend-chatering-online.vercel.app/api/v1/member/history", {
              headers:{
                'Authorization': `${token}`,
                "Content-Type": "multipart/form-data",
              }
            }
            );
            if(response.data.data){
              setHistoryData(response.data.data)
            }
        }
      }catch(error){
        console.log(error.response.data)
      }
    };

    return (
      <SafeAreaView>
        <View className="pt-3 bg-white">
          {/* headers */}

          <View className="flex-row items-center mx-4 space-x-2">
            <View className="flex-1">
              <Text className="font-bold text-xl">
                History - Maulana Catering
              </Text>
            </View>
          </View>
      </View>

      <View>
        <ShowHistory navigation={navigation} history={historyData} token={token}/>
      </View>

    </SafeAreaView>
    );
}

export default HistoryScreen;

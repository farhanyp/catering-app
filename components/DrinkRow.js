import React, {
  useState,
  useLayoutEffect,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ArrowRight from "../assets/arrow-right.svg";
import axios from "axios";
import DrinkCard from "./DrinkCard";

const DrinkRow = ({
  id,
  title,
  description,
  navigation,
}) => {
  const [drinks, setDrinks] = useState([]);
  const [dataFetched, setDataFetched] = useState(
    false
  );

  useLayoutEffect(() => {
    if (drinks.length === 0) {
      getAPIPackages();
    }
  }, [dataFetched]);

  const getAPIPackages = async () => {
    if (drinks.length === 0) {
      const response = await axios.get(
        "https://backend-chatering-online.vercel.app/api/v1/member/drink"
      );
      setDrinks(response.data.data);
      setDataFetched(true);
    }
  };

  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">
          {title}
        </Text>
      </View>

      <Text className="text-xs text-gray-500 px-4">
        {description}
      </Text>

      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {drinks.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          drinks.map((pack, index) => (
            <View key={index}>
              <DrinkCard
                data={pack}
                navigation={navigation}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DrinkRow;

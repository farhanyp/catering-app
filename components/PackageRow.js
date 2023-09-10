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
import PackageCard from "./PackageCard";
import axios from "axios";

const PackageRow = ({
  id,
  title,
  description,
  navigation,
}) => {
  const [packages, setPackages] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useLayoutEffect(() => {
    if (packages.length === 0) {
      getAPIPackages();
    }
  }, [dataFetched]);

  const getAPIPackages = async () => {
    if (packages.length === 0) {
      const response = await axios.get(
        "https://backend-chatering-online.vercel.app/api/v1/member/package"
      );
      setPackages(response.data.data);
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

      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {packages.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          packages.map((pack, index) => (
            <View key={index}>
              <PackageCard
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

export default PackageRow;

import React, {
  useState,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Image,
} from "react-native";
import CurrencyDollar from "../assets/currency-dollar.svg";

const PackageCard = ({ navigation, data }) => {
  const [priceTotal, setPriceTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    getPriceTotal()
  }, [navigation, priceTotal]);

  const getPriceTotal = () => {
    if(data.food !== null && data.drink !== null){
      if(data.food.price && data.drink.price){
        setPriceTotal((data.food.price + data.drink.price)-data.package.discount)
        setOriginalTotal(data.food.price + data.drink.price)
        setDiscount(data.package.discount)
      }
    }else{
      setPriceTotal(0)
    }
  }

  return (
    <TouchableOpacity className="bg-white mr-3 shadow">
      <View className="px-3 pb-4">
        <Text className="font-bold text-lg pt-2">
          {data.package.name}
        </Text>

        <View>
          <Image
            source={{
              uri: `data:${data.package.typeImage};base64,${data.package.dataImage}`,
            }}
            style={{ width: 200, height: 200 }}
          />
        </View>

        <View className="flex-row items-center space-x-1">
          <Text className="text-sm pt-2">
            {data.package.description}
          </Text>
        </View>

        <View className="flex-row items-center space-x-1">
          <CurrencyDollar
            opacity={0.4}
            width={22}
            height={22}
          />
          <Text className="text-xs text-gray-500 line-through">
            {originalTotal.toLocaleString("id-ID")}
          </Text>
          <Text className="text-xs text-gray-500 ">
            {priceTotal.toLocaleString("id-ID")}
          </Text>
        </View>
        <TouchableOpacity
          className=" bg-slate-500 w-20 h-10 mt-5 rounded items-center justify-center"
          onPress={() =>{
            data.package.price = priceTotal
            navigation.navigate("DetailPackage", {
              data,
            })
          }
          }
        >
          <Text className="text-white text-base font-bold">
            Pesan
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PackageCard;

import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Image,
} from "react-native";
import CurrencyDollar from "../assets/currency-dollar.svg";

const FoodCard = ({ data, navigation }) => {
  const formattedNumber = data.price.toLocaleString(
    "id-ID"
  );
  return (
    <TouchableOpacity className="bg-white mr-3 shadow">
      <View className="px-3 pb-4">
        <Text className="font-bold text-lg pt-2">
          {data.name}
        </Text>

        <View>
          <Image
            source={{
              uri: `data:${data.typeImage};base64,${data.dataImage}`,
            }}
            style={{ width: 200, height: 200 }}
          />
        </View>

        <View className="flex-row items-center space-x-1">
          <Text className="text-sm pt-2">
            {data.description}
          </Text>
        </View>

        <View className="flex-row items-center space-x-1">
          <CurrencyDollar
            opacity={0.4}
            width={22}
            height={22}
          />
          <Text className="text-xs text-gray-500">
            {formattedNumber}
          </Text>
        </View>

        <TouchableOpacity
          className=" bg-slate-500 w-20 h-10 mt-5 rounded items-center justify-center"
          onPress={() =>
            navigation.navigate("DetailFood", {
              data,
            })
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

export default FoodCard;

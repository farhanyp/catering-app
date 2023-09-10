import React, {
  useEffect,
  useLayoutEffect,
} from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import PowerIcon from "../assets/power.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PackageRow from "../components/PackageRow.js";
import FoodRow from "../components/FoodRow";
import DrinkRow from "../components/DrinkRow";

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    checkUserAccess();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const checkUserAccess = async () => {
    try {
      const token = await AsyncStorage.getItem(
        "token"
      );
      const role = await AsyncStorage.getItem(
        "role"
      );

      if (!token || !role) {
        // Jika tidak ada token atau role, arahkan ke layar login
        navigation.navigate("Login");
      } else if (role !== "user") {
        // Jika role bukan user, arahkan ke layar lain (misalnya, Dashboard)
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.error(
        "Error checking user access:",
        error
      );
    }
  };

  const handleLogout = async () => {
    try {
      // Hapus token dan role dari AsyncStorage saat logout
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");

      // Arahkan pengguna ke layar login setelah logout
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView>
      <View className="pt-3 bg-white">
        {/* headers */}

        <View className="flex-row pb-3 items-center mx-4 space-x-2">
          <Image
            source={{
              uri:
                "https://links.papareact.com/wru",
            }}
            className="h-7 w-7 bg-gray-300 p-4 rounded-full"
          />

          <View className="flex-1">
            <Text className="font-bold text-xl">
              Maulana Catering
            </Text>
          </View>

          <TouchableOpacity>
            <PowerIcon
              width={25}
              height={25}
              onPress={handleLogout}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="bg-gray-100"
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        >
          {/* Featured Rows */}
          <PackageRow
            id="123"
            title="Paket"
            description="Paid placements from our partners"
            navigation={navigation}
          />

          <FoodRow
            id="123"
            title="Makanan"
            description="Paid placements from our partners"
            navigation={navigation}
          />

          <DrinkRow
            id="123"
            title="Minuman"
            description="Paid placements from our partners"
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

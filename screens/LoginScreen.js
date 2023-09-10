import React, {
  useState,
  useLayoutEffect,
} from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://backend-chatering-online.vercel.app/api/v1/member/login",
        {
          username: username,
          password: password,
        }
      );

      const token = response.data.data.token;
      const role = response.data.data.role;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);

      const cookieToken = await AsyncStorage.getItem(
        "token"
      );
      const cookieRole = await AsyncStorage.getItem(
        "role"
      );
      setLoading(false);
      if(role === "admin"){
        navigation.navigate("Dashboard");
      }
      navigation.navigate("Home");
    } catch (error) {
      if (error.response.data.errors !== undefined) {
        Alert.alert(
          "Kesalahan Login",
          error.response.data.errors
        );
      }
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl mb-4">Login</Text>
      <TextInput
        className="w-full h-12 border rounded p-2 mb-2"
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        className="w-full h-12 border rounded p-2 mb-2"
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity
        className="w-full h-12 bg-blue-500 rounded items-center justify-center"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg">
          {loading ? (
            <ActivityIndicator
              animating={loading}
              size="large"
            />
          ) : (
            "Login"
          )}
        </Text>
      </TouchableOpacity>
      <Text className=" mt-8 h-10 rounded items-center justify-center">
        Have you registered yet?
      </Text>
      <TouchableOpacity
        className=" bg-slate-500 w-20 h-10 rounded items-center justify-center"
        onPress={() =>
          navigation.navigate("Register")
        }
      >
        <Text className="text-white">
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

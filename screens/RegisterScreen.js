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
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://backend-chatering-online.vercel.app/api/v1/member/register",
        {
          username: username,
          password: password,
          address: address,
          phoneNumber: phone,
          postalCode: postalCode,
        }
      );

      Alert.alert(
        "Berhasil!",
        `Akun anda berhasil didaftarkan`
      );
      setLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      if (error.response.data.errors) {
        Alert.alert(
          "Kesalahan Register",
          error.response.data.errors
        );
      }
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl mb-4">
        Register
      </Text>
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
      <TextInput
        className="w-full h-12 border rounded p-2 mb-2"
        placeholder="Alamat"
        onChangeText={(text) => setAddress(text)}
        value={address}
      />
      <TextInput
        className="w-full h-12 border rounded p-2 mb-2"
        placeholder="Nomor Hp"
        onChangeText={(text) => setPhone(text)}
        value={phone}
        inputMode="numeric"
      />
      <TextInput
        className="w-full h-12 border rounded p-2 mb-2"
        placeholder="Kode Pos"
        onChangeText={(text) => setPostalCode(text)}
        value={postalCode}
        inputMode="numeric"
      />
      <TouchableOpacity
        className="w-full h-12 bg-slate-500 rounded items-center justify-center"
        onPress={handleRegister}
      >
        <Text className="text-white text-lg">
          {loading ? (
            <ActivityIndicator
              animating={loading}
              size="large"
            />
          ) : (
            "Register"
          )}
        </Text>
      </TouchableOpacity>
      <Text className=" mt-8 h-10 rounded items-center justify-center">
        Apakah kamu mempunyai akun ?
      </Text>
      <TouchableOpacity
        className=" bg-blue-500 w-20 h-10 rounded items-center justify-center"
        onPress={() =>
          navigation.navigate("Login")
        }
      >
        <Text className="text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

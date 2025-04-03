import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import UserStore from "../zustand/UserStore";
import img from '../assets/Myntra_Logo.png';
import Ionicon from "react-native-vector-icons/Ionicons";

export default function Signup({ setSignInPopUp, offerBanner }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validatePhoneNumber = (number) => {
    return /^\+\d{1,3}\d{7,15}$/.test(number);
  };

  const signInWithPhoneNumberHandler = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setMessage("Invalid phone number format.");
      return;
    }

    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      
      setSignInPopUp(false);
      navigation.navigate("OtpVerification", { confirmation, phoneNumber });

    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={img} style={styles.logo} />
        <Ionicon name="close-sharp" size={24} onPress={() => setSignInPopUp(false)} />
      </View>

      {offerBanner && (
        <View style={styles.offerBannerContainer}>
          <Image style={styles.offerBanner} />
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.label}>
          <Text style={{ fontWeight: 'bold' }}>Login</Text> <Text style={{ fontSize: 14 }}>or</Text> <Text style={{ fontWeight: 'bold' }}>Signup</Text>
        </Text>
        <TextInput
          placeholder="+1 650-555-3434"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Button title="Send OTP" onPress={signInWithPhoneNumberHandler} disabled={loading} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    paddingVertical: 20,
    borderRadius: 50
  },
  header: {
    height: '20%',
    width: "100%",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  offerBannerContainer: {
    height: 100,
    width: "100%",
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
  },
  offerBanner: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    alignItems: "center",
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
  },
});

import { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserStore from "../zustand/UserStore";

export default function OtpVerification() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const otpInputRef = useRef(null);
  const setUser = UserStore((state) => state.setUser);
  const navigation = useNavigation();
  const route = useRoute();
  const { confirmation, phoneNumber } = route.params;

  const confirmCode = async () => {
    if (!confirmation) {
      setMessage("Please request a new OTP.");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmation.confirm(code);
      setMessage("Phone authentication successful!");
      setUser({
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
      });

      navigation.navigate("ProfileMain"); 
    } catch (error) {
      console.error("Invalid code:", error);
      setMessage("Invalid OTP. Try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {phoneNumber}</Text>

      <TextInput
        ref={otpInputRef}
        placeholder="123456"
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, "").slice(0, 6))}
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
      />

      <Button title="Verify OTP" onPress={confirmCode} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});

import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicon from "react-native-vector-icons/Ionicons";
import UserStore from "../zustand/UserStore";

export default function OtpVerification() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const otpInputRef = useRef(null);
  const setUser = UserStore((state) => state.setUser);
  const navigation = useNavigation();
  const route = useRoute();
  const { confirmation, phoneNumber } = route.params;

  const confirmCode = async (inputCode) => {
    if (!confirmation) {
      setError("Please request a new OTP.");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmation.confirm(inputCode);
      setMessage("Phone authentication successful!");
      setUser({
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
      });

      navigation.navigate("ProfileMain");
    } catch (error) {
      console.error("Invalid code:", error);
      setError("Invalid OTP. Try again.");
    }
    setLoading(false);
  };

  const handleTextChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);

    if (cleaned.length === 6) {
      otpInputRef.current.blur();
      confirmCode(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicon name='arrow-back-sharp' size={24} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Enter OTP</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Verify with OTP</Text>
        <Text style={styles.subtitle}>Sent via SMS to {phoneNumber}</Text>

        <TextInput
          ref={otpInputRef}
          placeholder="123456"
          value={code}
          onChangeText={(text) => handleTextChange(text)}
          keyboardType="number-pad"
          style={[styles.input, error && styles.inputError]}
          maxLength={6}
        />
        {error ? <Text style={styles.message}>{message}</Text> : null}

        {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10
  },
  header: {
    flexDirection: "row",
    marginVertical: 50,
    gap: 20,
  },
  body: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
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
  },
  message: {
    fontSize: 12,
    color: "red",
    marginTop: 10
  },
  inputError: {
    borderColor: "red",
  },  
});

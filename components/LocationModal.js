import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, updateDoc } from "@react-native-firebase/firestore";
import UserStore from "../zustand/UserStore";
import useModalStore from "../zustand/ModalStore";

const auth = getAuth();
const db = getFirestore();

const AddLocationModal = ({ isAddLocationModalOpen, setIsAddLocationModalOpen }) => {
  const inputRef = useRef(null);
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");

  useEffect(() => {
    if (isAddLocationModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAddLocationModalOpen]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (pincode.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await response.json();
          const postOffice = data?.[0]?.PostOffice?.[0];

          if (postOffice) {
            setCity(postOffice.District);
            setState(postOffice.State);
          } else {
            Alert.alert("Invalid Pincode", "Could not fetch location details.");
            setCity("");
            setState("");
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
    };

    fetchLocationDetails();
  }, [pincode]);

  const updateAddress = UserStore((state) => state.updateAddress);
const isAuthenticated = UserStore((state) => state.isAuthenticated);
const openModal = useModalStore((state) => state.openModal);

const handleSubmit = async () => {
  if (!isAuthenticated) {
    setIsAddLocationModalOpen(false);
    openModal(); 
    return;
  }

  if (!pincode || !city || !state || !landmark) {
    Alert.alert("Missing Fields", "Please fill all address details.");
    return;
  }

  const address = { pincode, city, state, landmark };
  const success = await updateAddress(address);

  if (success) {
    Alert.alert("Success", "Address updated!");
    setIsAddLocationModalOpen(false);
    setPincode("");
    setCity("");
    setState("");
    setLandmark("");
  } else {
    Alert.alert("Error", "Failed to update address.");
  }
};

  return (
    <Modal
      visible={isAddLocationModalOpen}
      onRequestClose={() => setIsAddLocationModalOpen(false)}
      animationType="slide"
      transparent
    
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeaderText}>Select Delivery Location</Text>

            <TextInput
              ref={inputRef}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter pincode"
              placeholderTextColor={'#222'}
              value={pincode}
              onChangeText={setPincode}
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor={'#222'}
              value={city}
              editable={false}
            />

            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor={'#222'}
              value={state}
              editable={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={landmark}
              placeholderTextColor={'#222'}
              onChangeText={setLandmark}
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    gap: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    elevation: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  modalHeaderText: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddLocationModal;

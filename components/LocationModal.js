import { useEffect, useRef } from "react";
import {
    Modal,
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddLocationModal = ({ isAddLocationModalOpen, setIsAddLocationModalOpen }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isAddLocationModalOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isAddLocationModalOpen]);

    return (
        <Modal
            visible={isAddLocationModalOpen}
            onRequestClose={() => setIsAddLocationModalOpen(false)}
            animationType="slide"
            transparent
        >
            <TouchableWithoutFeedback onPress={() => setIsAddLocationModalOpen(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalHeaderText}>Select Delivery Location</Text>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="Enter location"
                                placeholderTextColor="#888"
                            />
                            <View style={styles.modalFooter}>
                                <Ionicons name="map-outline" size={16}/>
                                <Text>Search location</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
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
        gap: 5,
        backgroundColor: "#fff",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 20,
        alignItems: "center",
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 10,
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
        paddingBottom: 10
    },
    modalFooter: { flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "flex-start", gap:5, paddingTop:15 }
});

export default AddLocationModal;

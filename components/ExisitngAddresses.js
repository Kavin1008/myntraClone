import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import UserStore from '../zustand/UserStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ExisitngAddresses = ({ onAddressSelect }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const user = UserStore(state => state.user);

    useEffect(() => {
        if (user?.addresses) {
            setAddresses(user.addresses);
            setSelectedAddress(user.currentAddress)
        }
    }, [user]);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        if (onAddressSelect) {
            onAddressSelect(address);
        }
    };

    const renderAddressItem = (address, index) => {
        const isSelected = selectedAddress?.pincode === address.pincode;
        
        return (
            <Pressable 
                key={`${address.pincode}-${index}`}
                style={[styles.addressItem, isSelected && styles.selectedAddressItem]}
                onPress={() => handleAddressSelect(address)}
            >
                <View style={styles.addressTypeContainer}>
                    <Ionicons 
                        name={address.type === 'HOME' ? 'home' : 'briefcase'} 
                        size={16} 
                        color={isSelected ? '#ff3e6c' : '#666'} 
                    />
                    <Text style={[styles.addressTypeText, isSelected && styles.selectedAddressText]}>
                        {address.type}
                    </Text>
                </View>
                <Text style={styles.addressText}>
                    {address.locality}, {address.landmark}
                </Text>
                <Text style={styles.addressText}>
                    {address.city}, {address.state} - {address.pincode}
                </Text>
                {isSelected && (
                    <Ionicons 
                        name="checkmark-circle" 
                        size={20} 
                        color="#ff3e6c" 
                        style={styles.selectedIcon} 
                    />
                )}
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
                {addresses.map((address, index) => (
                    renderAddressItem(address, index)
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        gap:12
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 12,
    },
    addressItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    selectedAddressItem: {
        borderColor: '#ff3e6c',
        backgroundColor: '#fff0f5',
    },
    addressTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    addressTypeText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    selectedAddressText: {
        color: '#ff3e6c',
    },
    addressText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 2,
    },
    selectedIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
});

export default ExisitngAddresses;
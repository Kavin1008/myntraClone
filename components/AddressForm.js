// components/AddressForm.js
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddressForm = ({
  pincode,
  setPincode,
  city,
  state,
  locality,
  setLocality,
  landmark,
  setLandmark,
  addressType,
  setAddressType,
  fetchLocationDetails,
  inputRef
}) => {
  return (
    <>
      <Text style={styles.sectionHeader}>Add New Address</Text>
      <View style={styles.pincodeContainer}>
        <TextInput
          ref={inputRef}
          style={styles.pincodeInput}
          keyboardType="numeric"
          placeholder="Enter pincode"
          placeholderTextColor={'#666'}
          value={pincode}
          onChangeText={setPincode}
          maxLength={6}
        />
        <TouchableOpacity
          style={styles.checkPincodeButton}
          onPress={fetchLocationDetails}>
          <Text style={styles.checkPincodeText}>Check Pincode</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addressTypeContainer}>
        <Pressable
          style={[
            styles.addressTypeButton,
            addressType === 'HOME' && styles.activeAddressType,
          ]}
          onPress={() => setAddressType('HOME')}>
          <Text
            style={[
              styles.addressTypeText,
              addressType === 'HOME' && styles.activeAddressTypeText,
            ]}>
            HOME
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.addressTypeButton,
            addressType === 'OFFICE' && styles.activeAddressType,
          ]}
          onPress={() => setAddressType('OFFICE')}>
          <Text
            style={[
              styles.addressTypeText,
              addressType === 'OFFICE' && styles.activeAddressTypeText,
            ]}>
            OFFICE
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Locality"
        placeholderTextColor={'#999'}
        value={locality}
        onChangeText={setLocality}
      />

      <TextInput
        style={styles.input}
        placeholder="Landmark"
        placeholderTextColor={'#999'}
        value={landmark}
        onChangeText={setLandmark}
      />

      <View style={styles.cityStateContainer}>
        <TextInput
          style={[styles.input, styles.cityStateInput]}
          placeholder="City"
          placeholderTextColor={'#999'}
          value={city}
          editable={false}
        />
        <TextInput
          style={[styles.input, styles.cityStateInput]}
          placeholder="State"
          placeholderTextColor={'#999'}
          value={state}
          editable={false}
        />
      </View>
    </>
  );
};

export default AddressForm;



const styles = StyleSheet.create({
    pincodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      pincodeInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
      },
      checkPincodeButton: {
        paddingHorizontal: 4,
        paddingVertical: 12,
        borderRadius: 8,
      },
      checkPincodeText: {
        color: '#ff3e6c',
        fontWeight: '500',
      },
      sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 0,
      },
      orText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 8,
      },
      addressTypeContainer: {
        flexDirection: 'row',
        gap: 10,
      },
      addressTypeButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      activeAddressType: {
        borderColor: '#ff3e6c',
        backgroundColor: '#fff0f5',
      },
      addressTypeText: {
        color: '#666',
        fontWeight: '500',
      },
      activeAddressTypeText: {
        color: '#ff3e6c',
      },
      input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
      },
      cityStateContainer: {
        flexDirection: 'row',
        gap: 10,
      },
      cityStateInput: {
        color:"#999",
        backgroundColor:"#e1e1e1",
        flex: 1,
      },
})
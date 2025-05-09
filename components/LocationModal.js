// screens/AddLocationModal.js
import React, { useEffect, useRef, useState } from 'react';
import { 
  Modal, 
  View, 
  TouchableWithoutFeedback, 
  Keyboard, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Dimensions,
  StyleSheet
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import UserStore from '../zustand/UserStore';
import useModalStore from '../zustand/ModalStore';

import ModalHeader from './ModalHeader';
import LocationAccessButton from './LocationAccessButton';
import AddressForm from './AddressForm';
import ExisitngAddresses from './ExisitngAddresses';
import CircularLoader from './Loader';
import { Text } from 'react-native-paper';

const auth = getAuth();
const db = getFirestore();

const AddLocationModal = ({ isAddLocationModalOpen, setIsAddLocationModalOpen }) => {
  const [formState, setFormState] = useState({
    pincode: '',
    city: '',
    state: '',
    locality: '',
    landmark: '',
    addressType: 'HOME',
    loading: false
  });

  const inputRef = useRef(null);
  const { updateAddress, isAuthenticated, setCurrentAddress } = UserStore();
  const openModal = useModalStore(state => state.openModal);

  useEffect(() => {
    if (isAddLocationModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAddLocationModalOpen]);

  const fetchLocationDetails = async () => {
    if (formState.pincode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${formState.pincode}`,
        );
        const data = await response.json();
        const postOffice = data?.[0]?.PostOffice?.[0];

        if (postOffice) {
          setFormState(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
            locality: postOffice.Name
          }));
        } else {
          Alert.alert('Invalid Pincode', 'Could not fetch location details.');
          setFormState(prev => ({
            ...prev,
            city: '',
            state: '',
            locality: ''
          }));
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    } else {
      Alert.alert('Invalid Pincode', 'Could not fetch location details.');
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setIsAddLocationModalOpen(false);
      openModal();
      return;
    }

    if (!formState.pincode || !formState.city || !formState.state || !formState.landmark || !formState.locality) {
      Alert.alert('Missing Fields', 'Please fill all address details.');
      return;
    }

    const address = {
      pincode: formState.pincode,
      city: formState.city,
      state: formState.state,
      landmark: formState.landmark,
      locality: formState.locality,
      type: formState.addressType,
    };

    try {
      const success = await updateAddress(address, true);
      if (success) {
        Alert.alert('Success', 'Address updated!');
        setIsAddLocationModalOpen(false);
        resetForm();
      } else {
        Alert.alert('Error', 'Failed to update address.');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address.');
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission required',
          'Location permission is needed to use this feature',
        );
        return;
      }
      
      setFormState(prev => ({ ...prev, loading: true }));
      const position = await getCurrentPosition();
      const address = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude,
      );

      if (address) {
        setFormState(prev => ({
          ...prev,
          locality: address.locality || '',
          city: address.city || '',
          state: address.state || '',
          pincode: address.postalCode || '',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setFormState(prev => ({ ...prev, loading: false }));
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=73c8fef025a7419fb2cbbe962fe1d45a`,
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const properties = feature.properties;

        return {
          locality: properties.suburb || properties.district || '',
          city: properties.state_district || properties.county || '',
          state: properties.state || '',
          postalCode: properties.postcode || '',
          country: properties.country || '',
          formattedAddress: properties.formatted || '',
          street: properties.street || properties.address_line1 || '',
          landmark: properties.address_line2 || '',
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        };
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    });
  };

  const onAddressSelect = (address) => {
    setCurrentAddress(address);
    resetForm();
    setIsAddLocationModalOpen(false);
  };

  const resetForm = () => {
    setFormState({
      pincode: '',
      city: '',
      state: '',
      locality: '',
      landmark: '',
      addressType: 'HOME',
      loading: false
    });
  };

  const handleInputChange = (name, value) => {
    setFormState(prev => ({ ...prev, [name]: value }));
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
            <ModalHeader 
              title="Select Delivery Location" 
              onClose={() => setIsAddLocationModalOpen(false)} 
            />
            
            <View style={styles.scrollContentContainer}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <LocationAccessButton 
                  onPress={handleUseCurrentLocation} 
                  loading={formState.loading} 
                />

                <AddressForm
                  {...formState}
                  setPincode={(val) => handleInputChange('pincode', val)}
                  setLocality={(val) => handleInputChange('locality', val)}
                  setLandmark={(val) => handleInputChange('landmark', val)}
                  setAddressType={(val) => handleInputChange('addressType', val)}
                  fetchLocationDetails={fetchLocationDetails}
                  inputRef={inputRef}
                />

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>SAVE ADDRESS</Text>
                </TouchableOpacity>

                <ExisitngAddresses onAddressSelect={onAddressSelect} />
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddLocationModal;


const styles =  StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  scrollContentContainer: {
    height: Dimensions.get('window').height * 0.65,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  submitButton: {
    backgroundColor: '#ff3e6c',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
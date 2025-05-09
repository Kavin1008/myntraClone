// components/LocationAccessButton.js
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CircularLoader from './Loader';

const LocationAccessButton = ({ onPress, loading }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Ionicons name="locate" size={20} color={'#ff3e6c'} />
      <Text style={styles.text}>Use my current location</Text>
      <Ionicons name="chevron-forward-sharp" color={'#ff3e6c'} size={16} />
      {loading && <CircularLoader size="15" />}
    </Pressable>
  );
};

export default LocationAccessButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 16,
        gap:5
      },
      text: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#222',
      },
})
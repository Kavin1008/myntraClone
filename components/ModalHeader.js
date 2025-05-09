// components/ModalHeader.js
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ModalHeader = ({ title, onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onClose}>
        <Ionicons name="close" size={24} color="#222" />
      </Pressable>
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#222',
      },
})
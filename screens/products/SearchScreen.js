import React, { useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreen = () => {
    const inputRef = useRef(null)

    useEffect(() => {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 300); 
        return () => clearTimeout(timer);
      }, []);
    
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
        ref={inputRef}
          style={styles.input}
          placeholder="Search for brands and products"
          placeholderTextColor="gray"
        />
      </View>
      <Text style={styles.placeholderText}>Results will appear here...</Text>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

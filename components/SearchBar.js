import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";


const SearchBar = ({navigation}) => {
  return (
    
    <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate("SearchScreen")}>
    <Ionicons name="search" size={20} color="gray" style={styles.icon} />
    <Text style={styles.searchPlaceholder}>Search for brands and products</Text>
    <Ionicons name="camera-outline" size={20} color="gray" style={styles.icon} />
    <Ionicons name="mic-outline" size={20} color="gray" style={styles.icon} />
  </TouchableOpacity>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    searchBar: { flexDirection: "row", backgroundColor: "#f1f1f1", padding: 10, marginHorizontal: 10, borderWidth:1, borderStyle:"solid", borderColor:"black",borderRadius: 20, alignItems: "center", elevation:10 },
    icon: { marginHorizontal: 10 },
    searchPlaceholder: { flex: 1, color: "gray", fontSize: 11 },    
})
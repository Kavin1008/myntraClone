import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import useCartStore from "../zustand/CartStore";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; 

const CartScreen = () => {
  const { cartItems, loadCart } = useCartStore();
  const navigation = useNavigation();

  useEffect(() => {
    loadCart();
  }, []);

  const handleOpenDetails = (item) => {
    navigation.navigate("ProductDetail", {
      id: item.id,
      title: item.title,
      brand: item.brand,
      image: item.image,
      price: item.price,
      category: item.category,
      discount: item.discount,
      description: item.description || "Detailed description goes here",
      model: item.model || "Model XYZ",
      color: item.color || "Silver",
    });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer} onPress={() => handleOpenDetails(item)}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {item.title}
        </Text>
  
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          )}
          {item.discount && <Text style={styles.discount}>{item.discount}% OFF</Text>}
        </View>
  
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
  
        <Text style={styles.returnInfo}>7 days return available</Text>
      </View>
    </Pressable>
  );
  

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SHOPPING BAG</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {cartItems.length} Items selected for order
        </Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>PLACE ORDER • ₹{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 12,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  brand: {
    fontWeight: "bold",
    color: "#444",
  },
  name: {
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    fontSize: 13,
  },
  quantity: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },  
  discount: {
    color: "#e53935",
    fontSize: 13,
  },
  returnInfo: {
    color: "#4caf50",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 12,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  orderButton: {
    backgroundColor: "#ff3e6c",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
});

export default CartScreen;

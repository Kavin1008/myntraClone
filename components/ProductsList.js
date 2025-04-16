import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("https://fakestoreapi.in/api/products")
      .then(res => res.json())
      .then(response => {
        if (response.status === "SUCCESS" && Array.isArray(response.products)) {
          setProducts(response.products);
        } else {
          console.warn("Unexpected API response", response);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products: ", error);
        setLoading(false);
      });
  }, []);

  const handleCardPress = (item) => {
    console.log(item.id)
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text numberOfLines={2} style={styles.category}>{item.category}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 16;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 8,
    padding: 10,
    width: cardWidth,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    marginTop: 5,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  brand: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  category: {
    fontSize: 12,
    color: '#777',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ProductList;

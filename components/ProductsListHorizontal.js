import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native"; 

const { width } = Dimensions.get("window");

const ProductsListHorizontal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect(() => {
    fetch("https://fakestoreapi.in/api/products?limit=5")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "SUCCESS") {
          setProducts(res.products);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const ProductCard = ({ title, brand, image, price, category, discount, id }) => {
    const handleCardPress = () => {
      navigation.navigate("ProductDetail", {
        id,
        title,
        brand,
        image,
        price,
        category,
        discount,
        description: "Detailed description goes here", 
        model: "Model XYZ", 
        color: "Silver", 
      });
    };

    return (
      <LinearGradient colors={["#FFDEE9", "#fff"]} style={[styles.card]} onTouchEnd={handleCardPress}>
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.price}>${price}</Text>
        {discount > 0 && <Text style={styles.discount}>Discount: {discount}%</Text>}
      </LinearGradient>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Trending offers</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            title={item.title}
            brand={item.brand}
            image={item.image}
            price={item.price}
            category={item.category}
            discount={item.discount}
            id={item.id}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    marginVertical: 20,
  },
  list: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  card: {
    width: 180,
    height: 350,
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 120,
    height: 140,
    resizeMode: "contain",
    marginBottom: 10,
  },
  brand: {
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  category: {
    fontSize: 12,
    opacity: 0.7,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  discount: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductsListHorizontal;

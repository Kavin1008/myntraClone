import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, Dimensions, ActivityIndicator, Pressable } from "react-native";
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
      <Pressable style={[styles.card]} onTouchEnd={handleCardPress}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.cardContent}>
        <Text style={styles.title}>{title.slice(0,10)}...</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.price}>${price}</Text>
        {discount > 0 && <Text style={styles.discount}>Discount: {discount}%</Text>}
        </View>
      </Pressable>
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
      <Text style={{fontSize:20, fontWeight:'bold'}}>Curated for you</Text>
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
    maxHeight:250,
    borderRadius: 15,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    borderColor:'black',
    borderWidth:1
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode:'contain',
    marginBottom: 10,
  },
  cardContent:{
    position:'absolute',
    bottom:10,
    left:5,
  }, 
  brand: {
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  category: {
    fontSize: 12,
    opacity: 0.7,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  discount: {
    fontSize: 12,
    color: "red",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductsListHorizontal;

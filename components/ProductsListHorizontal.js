import { View, Text, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

// Sample Data
const products = [
  {
    id: "1",
    title: "Running Shoes",
    subtitle: "Best for marathon",
    brand: "Nike",
    image: "https://via.placeholder.com/150",
    bgColor: "#FFDEE9",
    textColor: "#333",
  },
  {
    id: "2",
    title: "Casual Sneakers",
    subtitle: "Lightweight & Comfortable",
    brand: "Adidas",
    image: "https://via.placeholder.com/150",
    bgColor: "#B5FFFC",
    textColor: "#222",
  },
  {
    id: "3",
    title: "Formal Leather",
    subtitle: "Elegant & Stylish",
    brand: "Louis Vuitton",
    image: "https://via.placeholder.com/150",
    bgColor: "#FFD89B",
    textColor: "#000",
  },
];

// Product Card Component
const ProductCard = ({ title, subtitle, brand, image, bgColor, textColor }) => {
  return (
    <LinearGradient colors={[bgColor, "#fff"]} style={[styles.card]}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={[styles.brand, { color: textColor }]}>{brand}</Text>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>
    </LinearGradient>
  );
};

// Horizontal Product List
const ProductsListHorizontal = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard {...item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    width: 150,
    height: 250,
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Shadow effect (Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 100,
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
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default ProductsListHorizontal;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useModalStore from '../zustand/ModalStore';
import useCartStore from '../zustand/CartStore';
import UserStore from '../zustand/UserStore';

const ProductDetail = ({route, navigation}) => {
  const {
    title,
    brand,
    image,
    price,
    description,
    model,
    color,
    category,
    discount,
  } = route.params;
  const {user, isAuthenticated} = UserStore();
  const openModal = useModalStore(state => state.openModal);
  const addToCart = useCartStore(state => state.addToCart);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openModal();
      return;
    }

    const productToAdd = {
      id: route.params.id,
      title,
      brand,
      image,
      price,
      category,
      discount,
    };

    addToCart(productToAdd);
    setShowAddedMessage(true);

    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    console.log('Buy now');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{model}</Text>
      </View>

      <ScrollView style={styles.container}>
        <Image source={{uri: image}} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.brand}>{brand}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Model:</Text>
            <Text style={styles.value}>{model}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{color}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{category}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionHeader}>Product Description</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.separator} />

          <Text style={styles.price}>₹{price}</Text>
          {discount > 0 && (
            <Text style={styles.discount}>Extra {discount}% off</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
      {showAddedMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Added to Cart Successfully</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 12,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#424242',
    width: 100,
  },
  value: {
    fontSize: 15,
    color: '#616161',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 16,
  },
  discount: {
    fontSize: 16,
    color: '#d32f2f',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#ff6f00',
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: '#ff6f00',
    paddingVertical: 12,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#1b5e20',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    zIndex: 20,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductDetail;

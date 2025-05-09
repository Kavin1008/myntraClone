import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useModalStore from '../zustand/ModalStore';
import useCartStore from '../zustand/CartStore';
import UserStore from '../zustand/UserStore';
import useWishlistStore from '../zustand/WishlistStore';
import {Screen} from 'react-native-screens';
import { BagIcon } from './Icons';
import CircularLoader from './Loader';

const ProductDetail = ({route, navigation}) => {
  const {id} = route.params;

  const [product, setProduct] = useState(route.params || null);
  const [loading, setLoading] = useState(!route.params?.title);

  const {user, isAuthenticated} = UserStore();
  const openModal = useModalStore(state => state.openModal);
  const addToCart = useCartStore(state => state.addToCart);
  const {wishlistItems, addToWishlist, removeFromWishlist} = useWishlistStore();

  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    if (!route.params?.title) {
      fetch(`https://fakestoreapi.in/api/products/${id}`)
        .then(res => res.json())
        .then(datas => {
          const data = datas.product
          setProduct({
            id: data.id,
            title: data.title,
            brand: data.brand || "Unknown Brand",
            image: data.image,
            price: data.price,
            description: data.description,
            model: data.model || "Standard",
            color: data.color || "Default",
            category: data.category,
            discount: data.discount || 0,
          });
          setLoading(false);
        })
        .catch(error => {
          console.log("Error fetching product:", error);
          setLoading(false);
        });
    }
  }, []);

  const isInWishlist = useMemo(() => {
    return wishlistItems.some(item => item.id === id);
  }, [wishlistItems, id]);
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openModal();
      return;
    }
    try {
      addToCart(product);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 2000);
    } catch (error) {
      console.log('Error in adding to cart: ', error);
    }
  };

  const handleBuyNow = () => {
    console.log("buy")
  }

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      openModal();
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading || !product) {
    return (
      <View style={[styles.screen, {justifyContent: 'center', alignItems: 'center'}]}>
        <CircularLoader />
      </View>
    );
  }

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
  } = product;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainApp', {screen: 'Home'}); 
    }
  };
  

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{model}</Text>
        </View>
        <View style={[styles.headerLeft, {gap: 20}]}>
          <Pressable>
            <Ionicons name="share-social-outline" size={20} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('wishlist')}>
            <Ionicons name="heart-outline" size={20} />
          </Pressable>
          {/* <Pressable
            onPress={() => navigation.navigate('MainApp', {screen: 'Bag'})}>
            <Ionicons name="bag-outline" size={20} />
          </Pressable> */}
          <BagIcon navigator={navigation}/>
        </View>
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
        <TouchableOpacity onPress={handleAddToWishlist}>
          <Ionicons
            name={isInWishlist ? 'heart' : 'heart-outline'}
            style={{color: '#ff3e6c'}}
            size={26}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
          <MaterialCommunityIcons
            name="cart-arrow-right"
            style={{color: '#ff3e6c'}}
            size={18}
          />
          <Text style={[styles.buttonText, {color: '#ff3e6c'}]}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Ionicons name="bag-outline" style={{color: 'white'}} size={18} />
          <Text style={styles.buttonText}>Add to Cart</Text>
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
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    alignItems: 'center',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ff3e6c',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 4,
    borderColor: '#ff3e6c',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
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

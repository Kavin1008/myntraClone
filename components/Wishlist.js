import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import useWishlistStore from '../zustand/WishlistStore';
import useCartStore from '../zustand/CartStore';
import { BagIcon } from './Icons';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

const Wishlist = () => {
  const navigation = useNavigation();
  const {wishlistItems, loadWishlist, removeFromWishlist} = useWishlistStore();
  const addToCart = useCartStore(state => state.addToCart);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleAddToBag = item => {
    const {id, title, brand, image, price, category, discount} = item;

    const productToAdd = {
      id,
      title,
      brand,
      image,
      price,
      category,
      discount,
    };

    addToCart(productToAdd);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleOpenBag = () => {
    navigation.navigate('MainApp', { screen: 'Bag' });
  }

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Pressable
        style={styles.close}
        onPress={() => removeFromWishlist(item.id)}>
        <Ionicons name="close" size={16} />
      </Pressable>
      <View style={styles.cardContent}>
        <Image source={{uri: item.image}} style={styles.image} />
        {/* <Text style={styles.title}>{item.title}</Text> */}
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <Pressable
        style={styles.addToBagContainer}
        onPress={() => handleAddToBag(item)}>
        <Text style={styles.addToBagText}>Add to Bag</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        {/* <TouchableOpacity onPress={handleOpenBag}>
          <Ionicons name="bag-outline" size={24} color="#000" />
        </TouchableOpacity> */}
        <BagIcon navigator={navigation} size={24}/>
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Your wishlist is empty 😢</Text>
          </View>
        }
      />
      {showAddedMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Added to Cart Successfully</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 80,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fafafa',
    borderRadius: 5,
    margin: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  cardContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },

  addToBagContainer: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#ff3e6c',
    borderRadius: 6,
    alignItems: 'center',
  },

  addToBagText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  close: {
    position: 'absolute',
    height: 20,
    width: 20,
    top: 10,
    right: 10,
    borderWidth: 1,
    borderColor: 'black',
    zIndex: 10,
    borderRadius: 100,
    backgroundColor: 'white',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginTop: 8,
  },
  brand: {
    fontSize: 12,
    color: '#757575',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 4,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  removeText: {
    fontSize: 13,
    color: '#d32f2f',
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
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

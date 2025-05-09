import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import useCartStore from '../zustand/CartStore';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Modal, ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';

import img from '../assets/emptyCart.png';
import useWishlistStore from '../zustand/WishlistStore';

const CartScreen = () => {
  const {cartItems, loadCart} = useCartStore();
  const navigation = useNavigation();

  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [itemToModify, setItemToModify] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);

  const {wishlistItems, addToWishlist} = useWishlistStore();

  const handleQuantityPress = item => {
    setSelectedItem(item);
    setQuantityModalVisible(true);
  };

  const handleQuantitySelect = qty => {
    if (selectedItem) {
      useCartStore.getState().updateItemQuantity(selectedItem.id, qty);
    }
    setQuantityModalVisible(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleOpenDetails = item => {
    navigation.navigate('ProductDetail', {
      id: item.id,
      title: item.title,
      brand: item.brand,
      image: item.image,
      price: item.price,
      category: item.category,
      discount: item.discount || 0,
      description: item.description || 'Detailed description goes here',
      model: item.model || 'Model XYZ',
      color: item.color || 'Silver',
    });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const renderItem = ({item}) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handleOpenDetails(item)}>
      {item.image && <Image source={{uri: item.image}} style={styles.image} />}
      <Pressable
        style={styles.removeFromCartContainer}
        onPress={() => {
          setItemToModify(item);
          setActionModalVisible(true);
        }}>
        <Ionicons
          name="close-sharp"
          style={{color: '#555', alignSelf: 'center'}}
          size={20}
        />
      </Pressable>

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
          {item.discount && (
            <Text style={styles.discount}>{item.discount}% OFF</Text>
          )}
        </View>

        <Pressable onPress={() => handleQuantityPress(item)}>
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        </Pressable>

        <Text style={styles.returnInfo}>7 days return available</Text>
      </View>
    </Pressable>
  );

  const isInWishlist = itemToModify
    ? wishlistItems.some(w => w.id === itemToModify.id)
    : false;

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.emptyCartImg} source={img} resizeMode="contain" />
        <Text style={styles.emptyTextBold}>Hey, it feels so light!</Text>
        <Text style={styles.emptyText}>
          There's nothing in your bag, add some items.
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
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
      <Modal
        visible={quantityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQuantityModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Quantity</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.quantityOptionsContainer}
              showsHorizontalScrollIndicator={false}>
              {Array.from({length: 10}, (_, i) => i + 1).map(qty => (
                <Pressable
                  key={qty}
                  onPress={() => handleQuantitySelect(qty)}
                  style={styles.quantityCircle}>
                  <Text style={styles.quantityText}>{qty}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setActionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modelTextContainer}>
              <Text style={styles.modalTitle}>Remove Item?</Text>
              <Pressable style={{height: 20, width: 40,}} onPress={() => {
                setActionModalVisible(false)
              }}>
                <Ionicons name="close-sharp" size={24} />
              </Pressable>
            </View>
            <View style={styles.itemTextContainer}>
              <View style={styles.itemImageHolder}>
                {itemToModify && (
                  <Image
                    source={{uri: itemToModify.image}}
                    style={[styles.modelImage, {}]}
                  />
                )}
              </View>
              <View>
                <Text style={{fontSize: 12, color: '#888'}}>
                  Are you sure you want to move this item from bag?
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => {
                  useCartStore.getState().removeFromCart(itemToModify.id);
                  Toast.show({
                    type: 'info',
                    text1: 'Item Removed',
                    text2: `${itemToModify.title} was removed from your cart.`,
                    position: 'bottom',
                  });
                  setActionModalVisible(false);
                }}>
                <Text style={styles.modalActionText}>REMOVE</Text>
              </TouchableOpacity>

              {isInWishlist ? (
                <TouchableOpacity
                  style={[
                    styles.modalActionButton,
                    {borderLeftWidth: 1, borderLeftColor: '#ccc'},
                  ]}
                  onPress={() => {
                    setActionModalVisible(false);
                  }}>
                  <Text style={styles.modalActionText}>KEEP THIS ITEM</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.modalActionButton,
                    {borderLeftWidth: 1, borderLeftColor: '#ccc'},
                  ]}
                  onPress={async () => {
                    await addToWishlist(itemToModify);
                    useCartStore.getState().removeFromCart(itemToModify.id);
                    Toast.show({
                      type: 'success',
                      text1: 'Moved to Wishlist',
                      text2: `${itemToModify.title} was removed from your cart.`,
                      position: 'bottom',
                    });
                    setActionModalVisible(false);
                  }}>
                  <Text style={styles.modalActionText}>MOVE TO WISHLIST</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  modelImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    fontWeight: 'bold',
    color: '#444',
  },
  name: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 13,
  },
  quantity: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  discount: {
    color: '#e53935',
    fontSize: 13,
  },
  returnInfo: {
    color: '#4caf50',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 12,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  orderButton: {
    backgroundColor: '#ff3e6c',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fbfbfb',
  },
  emptyCartImg: {
    height: 300,
    width: 300,
    marginBottom: 20,
  },
  emptyTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  quantityCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    color: '#000',
  },
  removeFromCartContainer: {
    height: 40,
    width: 40,
    position: 'absolute',
    top: 5,
    right: 0,
  },
  modalActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 30,
  },
  modalActionText: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  modelTextContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  itemImageHolder: {
    height: 70,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
});

export default CartScreen;

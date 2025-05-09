import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useCartStore from '../zustand/CartStore';

export const BagIcon = ({ navigator, size = 20, name = "bag-outline", color}) => {
  const cartItems = useCartStore(state => state.cartItems);
  const itemCount = cartItems.length;

  if(navigator)
  {
    return (
      <Pressable 
        onPress={() => navigator?.navigate('MainApp', { screen: 'Bag' })}
        style={styles.container}
      >
        <Ionicons name={name} size={size} color={color}/>
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {itemCount > 9 ? '9+' : itemCount}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <>
    <Ionicons name={name} size={size} color={color}/>
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {itemCount > 9 ? '9+' : itemCount}
            </Text>
          </View>
        )}
    </>
  )

};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff3e6c',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import CartScreen from '../../components/Cart';
import UserStore from '../../zustand/UserStore';
import useRouteStore from '../../zustand/RouteStore';
import useModalStore from '../../zustand/ModalStore';

const CartWrapperScreen = () => {
  const navigation = useNavigation();
  const user = UserStore(state => state.user);
  const {openModal} = useModalStore();
  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bag</Text>
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => {
            if (!user) {
              useRouteStore.getState().setRequestedRoute('wishlist', {});
              openModal();
            } else {
              navigation.navigate('wishlist');
            }
          }}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <CartScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  heartIcon: {
    padding: 8,
  },
});

export default CartWrapperScreen;

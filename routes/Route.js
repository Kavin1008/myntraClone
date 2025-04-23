import {StyleSheet} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/products/HomeScreen';
import OtpVerification from '../components/OtpVerification';
import Wishlist from '../components/Wishlist';
import ProtectedRoute from './ProtectedRoute';
import Splash from '../components/Splash';
import GlobalModal from '../components/SIgnupModal';
import Index from '../screens/profile/Index';
import MarqueePage from '../components/Marquee';
import AddUser from '../components/AddUser';
import ProductList from '../components/ProductsList';
import ProductDetail from '../components/ProductDetail';
import CartWrapperScreen from '../screens/Cart/CartScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import linking from './Linking';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animationTypeForReplace: 'push'}}>
      <Stack.Screen name="ProfileMain" component={Index} />
    </Stack.Navigator>
  );
};
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animationTypeForReplace: 'push'}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileStack} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff3e6c',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'FWD') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Luxury') {
            iconName = focused ? 'diamond' : 'diamond-outline';
          } else if (route.name === 'Bag') {
            iconName = focused ? 'bag' : 'bag-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="FWD" component={MarqueePage} />
      <Tab.Screen name="Luxury" component={ProductList} />
      <Tab.Screen name="Bag" component={CartWrapperScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator();

const Route = () => {
  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Splash" component={Splash} />
        <RootStack.Screen name="MainApp" component={TabNavigator} />
        <RootStack.Screen name="OtpVerification" component={OtpVerification} />
        <RootStack.Screen name="adduser" component={AddUser} />
        <RootStack.Screen name="ProductDetail" component={ProductDetail} />
        <RootStack.Screen name="wishlist" options={{headerShown: false}}>
        {() => (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        )}
      </RootStack.Screen>      
      </RootStack.Navigator>
      <GlobalModal />
    </NavigationContainer>
  );
};

export default Route;

const styles = StyleSheet.create({});

import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/products/HomeScreen';
import Profile from '../screens/profile/Profile';
import OtpVerification from '../components/OtpVerification';
import Wishlist from '../components/Wishlist';
import Signup from '../components/Signup';
import ProtectedRoute from './ProtectedRoute';
import Splash from '../components/Splash';
import GlobalModal from '../components/SIgnupModal';
import Index from '../screens/profile/Index';
import MarqueePage from '../components/Marquee';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationTypeForReplace: 'push' }}>
      <Stack.Screen name="ProfileMain" component={Index} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen 
          name="wishlist" 
          options={{ headerShown: false }}
        >
          {() => (
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          )}
        </Stack.Screen>
    </Stack.Navigator>
  );
}
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationTypeForReplace: 'push' }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileStack} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="FWD" component={MarqueePage} />
      <Tab.Screen name="Luxury" component={HomeScreen} />
      <Tab.Screen name="Bag" component={HomeScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator();

const Route = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={Splash} />
        <RootStack.Screen name="MainApp" component={TabNavigator} />
      </RootStack.Navigator>
      <GlobalModal />
    </NavigationContainer>
  );
};

export default Route;

const styles = StyleSheet.create({});

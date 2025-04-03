import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/products/HomeScreen';
import Profile from '../screens/profile/Profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false, animationTypeForReplace: 'push' }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

const Route = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="FWD" component={HomeScreen} />
        <Tab.Screen name="Luxury" component={HomeScreen} />
        <Tab.Screen name="Bag" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Route;

const styles = StyleSheet.create({});

import React from 'react';
import Route from './routes/Route';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <GestureHandlerRootView>
      <Route />
      <Toast />
    </GestureHandlerRootView>
  );
}

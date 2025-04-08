import React from 'react';
import Route from './routes/Route';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
      <Route />
    </GestureHandlerRootView>
  );
}



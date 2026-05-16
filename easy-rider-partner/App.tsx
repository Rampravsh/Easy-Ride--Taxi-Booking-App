import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { Navigation } from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css"; // Assuming nativewind setup

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </Provider>
  );
}

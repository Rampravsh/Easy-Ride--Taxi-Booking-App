import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { View, Text } from 'react-native';

// Placeholder screens
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={() => <PlaceholderScreen name="Welcome" />} />
      <Stack.Screen name="SignIn" component={() => <PlaceholderScreen name="SignIn" />} />
      <Stack.Screen name="SignUp" component={() => <PlaceholderScreen name="SignUp" />} />
    </Stack.Navigator>
  );
};

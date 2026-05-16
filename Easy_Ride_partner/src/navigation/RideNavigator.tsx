import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export const RideNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActiveRide" component={() => <PlaceholderScreen name="ActiveRide" />} />
      <Stack.Screen name="RideSummary" component={() => <PlaceholderScreen name="RideSummary" />} />
    </Stack.Navigator>
  );
};

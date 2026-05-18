import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { RootStackParamList } from './types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { restoreSessionThunk } from '../redux/slices/authSlice';
import { useTheme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Premium Full Screen Splash Loading Gate
 */
const FullScreenLoading = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.brandText, { color: theme.colors.primary }]}>EASY RIDE</Text>
      <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
        Loading secure session...
      </Text>
    </View>
  );
};

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { initialized, authenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Attempt session restoration from AsyncStorage
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  if (!initialized) {
    return <FullScreenLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 20,
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
  },
});


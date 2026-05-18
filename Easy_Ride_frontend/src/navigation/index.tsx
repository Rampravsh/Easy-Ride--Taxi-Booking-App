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

// Realtime Services Orchestration
import { socketService } from '../services/socket.service';
import { realtimeChatService } from '../services/realtimeChat.service';
import { callService } from '../services/call.service';
import { NotificationService } from '../services/notification.service';
import { realtimeRideService } from '../services/realtimeRide.service';

import { ErrorBoundary } from '../components/ErrorBoundary';
import { AppStateHandler } from '../components/AppStateHandler';
import { OfflineBanner } from '../components/OfflineBanner';
import { GlobalLoader } from '../components/GlobalLoader';
import { deepLinkService } from '../services/deepLink.service';

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
    // Initialize deep linking parameters
    deepLinkService.initialize();
    
    // Attempt session restoration from AsyncStorage
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  useEffect(() => {
    if (authenticated) {
      console.log('📡 [AppNavigator] User authenticated, boot-strapping realtime ecosystem...');
      
      // Establish socket connection
      socketService.connect().then(() => {
        // Initialize listener subscriptions
        realtimeChatService.initialize();
        callService.initialize();
        NotificationService.initialize();
        realtimeRideService.initialize();
      }).catch((err) => {
        console.error('📡 [AppNavigator] Realtime handshakes failed to connect:', err);
      });

      return () => {
        console.log('📡 [AppNavigator] User logging out, tearing down realtime handlers...');
        realtimeChatService.destroy();
        callService.destroy();
        NotificationService.destroy();
        realtimeRideService.cleanupListeners();
        socketService.disconnect();
      };
    }
  }, [authenticated]);


  if (!initialized) {
    return <FullScreenLoading />;
  }

  return (
    <ErrorBoundary>
      <AppStateHandler />
      <OfflineBanner />
      <GlobalLoader />
      
      <NavigationContainer linking={deepLinkService.getLinkingConfig(null) as any}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authenticated ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
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


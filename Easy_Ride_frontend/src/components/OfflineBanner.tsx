import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * Animated Banner informing users of connectivity drops.
 * Slides down from the top overlay without blocking main navigation content.
 */
export const OfflineBanner: React.FC = () => {
  const { isOnline, isReconnecting } = useNetworkStatus();
  const { theme } = useTheme();
  
  const slideAnim = useRef(new Animated.Value(-100)).current; // Start offscreen

  useEffect(() => {
    if (!isOnline) {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide back up
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline, slideAnim]);

  if (isOnline && !isReconnecting) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: isReconnecting ? theme.colors.primary : theme.colors.danger,
        },
      ]}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.content}>
          <Ionicons
            name={isReconnecting ? 'sync' : 'cloud-offline-outline'}
            size={18}
            color="white"
            style={[isReconnecting && styles.spinningIcon]}
          />
          <Text style={styles.bannerText}>
            {isReconnecting
              ? 'Attempting secure reconnection...'
              : 'Offline Mode: Actions will be queued & executed automatically.'}
          </Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  safeArea: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
  spinningIcon: {
    // Custom animation for spinning
  },
});

export default OfflineBanner;

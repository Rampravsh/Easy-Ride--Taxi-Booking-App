import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ActivityIndicator, Animated } from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { hideToast } from '../redux/slices/appSlice';
import { useTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * Enterprise-grade loading overlay and floating toast container.
 * Subscribes directly to `appSlice` properties for modal rendering.
 */
export const GlobalLoader: React.FC = () => {
  const { globalLoading, loadingMessage, toast } = useAppSelector((state) => state.app);
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const toastOpacity = React.useRef(new Animated.Value(0)).current;

  // Manage custom animated triggers for floating notification banners
  useEffect(() => {
    if (toast) {
      Animated.sequence([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(toast.duration || 3000),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dispatch(hideToast());
      });
    }
  }, [toast, toastOpacity, dispatch]);

  return (
    <>
      {/* 1. Fullscreen Activity Overlay */}
      <Modal
        transparent
        animationType="fade"
        visible={globalLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.overlayContainer}>
          <View style={[styles.loaderCard, { backgroundColor: theme.colors.card }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              {loadingMessage || 'Please wait...'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* 2. Centralized Toast Notification Banner */}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastOpacity,
              backgroundColor:
                toast.type === 'success'
                  ? theme.colors.success
                  : toast.type === 'error'
                  ? theme.colors.danger
                  : theme.colors.primary,
            },
          ]}
        >
          <Ionicons
            name={
              toast.type === 'success'
                ? 'checkmark-circle-outline'
                : toast.type === 'error'
                ? 'alert-circle-outline'
                : 'information-circle-outline'
            }
            size={20}
            color="white"
          />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderCard: {
    padding: 24,
    borderRadius: 16,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
});

export default GlobalLoader;

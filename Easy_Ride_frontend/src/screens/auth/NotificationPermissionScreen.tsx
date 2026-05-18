import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { useAppDispatch } from '../../redux/hooks';
import { setNotificationPermissionGranted } from '../../redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';

export const NotificationPermissionScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'NotificationPermission'>>();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  // Notification preview slide shared value
  const previewTranslateY = useSharedValue(20);
  const previewOpacity = useSharedValue(0);

  useEffect(() => {
    previewTranslateY.value = withTiming(0, { duration: 600 });
    previewOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const previewStyle = useAnimatedStyle(() => {
    return {
      opacity: previewOpacity.value,
      transform: [{ translateY: previewTranslateY.value }],
    };
  });

  const handleRequestNotifications = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === 'granted';
      dispatch(setNotificationPermissionGranted(granted));

      if (granted) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        console.warn('[NotificationPermissionScreen] Notification permission denied');
      }
      
      // Proceed seamlessly to step 3: BiometricSetupScreen
      navigation.navigate('BiometricSetup' as any);
    } catch (err: any) {
      console.error('[NotificationPermissionScreen] Permission error:', err);
      dispatch(setNotificationPermissionGranted(false));
      navigation.navigate('BiometricSetup' as any);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(setNotificationPermissionGranted(false));
    navigation.navigate('BiometricSetup' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* Header step tracking */}
      <View style={styles.topHeader}>
        <Text style={[styles.progressLabel, { color: theme.colors.primary }]}>STEP 3 OF 4</Text>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Visual Push Notification Preview illustration */}
        <View style={styles.visualContainer}>
          <Animated.View 
            style={[
              styles.notificationPreview, 
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, 
              previewStyle
            ]}
          >
            <View style={styles.previewHeader}>
              <View style={[styles.appBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.appBadgeIcon}>🚕</Text>
              </View>
              <View style={styles.previewHeaderRight}>
                <Text style={[styles.appTitle, { color: theme.colors.text }]}>EASY RIDE</Text>
                <Text style={[styles.appTime, { color: theme.colors.textSecondary }]}>now</Text>
              </View>
            </View>
            <View style={styles.previewBody}>
              <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>Captain John is 2 mins away!</Text>
              <Text style={[styles.notificationDesc, { color: theme.colors.textSecondary }]}>
                Your black luxury Mercedes Benz S-Class is pulling up to Nob Hill. Meet your captain at the corner.
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primary }]} />
            </View>
          </Animated.View>
        </View>

        {/* Text descriptions */}
        <Animated.View style={styles.textGroup} entering={FadeInDown.delay(100)}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Stay Synced, Stay Alert</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Enable push notifications to track your captain's path, get instant arrivals alerts, and view pricing receipts dynamically.
          </Text>
        </Animated.View>

        {/* Benefits bullets list */}
        <Animated.View style={styles.bulletsContainer} entering={FadeInDown.delay(200)}>
          <View style={styles.bulletItem}>
            <View style={[styles.bulletIconWrapper, { backgroundColor: 'rgba(76,175,80,0.1)' }]}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            </View>
            <Text style={[styles.bulletText, { color: theme.colors.text }]}>Driver Arrival alerts (avoid cancellation fees)</Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={[styles.bulletIconWrapper, { backgroundColor: 'rgba(76,175,80,0.1)' }]}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            </View>
            <Text style={[styles.bulletText, { color: theme.colors.text }]}>Realtime price drop notifications & coupon updates</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <AppButton 
          title={loading ? 'Enabling alerts...' : 'Allow Push Notifications'} 
          onPress={handleRequestNotifications} 
          loading={loading}
          disabled={loading}
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          textStyle={styles.primaryButtonText}
        />
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkip}>
          <Text style={[styles.secondaryBtnText, { color: theme.colors.textSecondary }]}>Skip alerts registration</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  skipBtn: {
    padding: spacing.xs,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  visualContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  notificationPreview: {
    width: '100%',
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  appBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  appBadgeIcon: {
    fontSize: 15,
  },
  previewHeaderRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  appTime: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  previewBody: {
    marginBottom: spacing.md,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '40%',
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  bulletsContainer: {
    paddingHorizontal: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bulletIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  bulletText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  primaryButton: {
    height: 56,
    borderRadius: radius.button,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  secondaryBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    padding: spacing.sm,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
});

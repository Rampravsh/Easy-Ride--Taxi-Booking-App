import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AuthHeader } from '../../components/common/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

export const GoogleLoginScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'GoogleLogin'>>();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Simulate Google Sign-In SDK + Firebase Link
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('RiderRegistration');
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <AuthHeader onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.brandCircle, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="logo-google" size={60} color={theme.colors.primary} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Secure Google Sign-In</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sign in securely using your existing Google account to sync your profile instantly.
          </Text>
        </View>

        <View style={styles.badgeSection}>
          <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="shield-checkmark" size={20} color={theme.colors.success || '#4CAF50'} />
            <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>End-to-End Secure</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="cloud-done" size={20} color={theme.colors.success || '#4CAF50'} />
            <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>Instant Syncing</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.googleBtn, { backgroundColor: theme.colors.text, borderColor: theme.colors.border }]}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color={theme.colors.background} style={styles.googleIcon} />
                <Text style={[styles.googleBtnText, { color: theme.colors.background }]}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  brandCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  badgeSection: {
    width: '100%',
    marginBottom: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 24,
  },
  googleBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  googleIcon: {
    marginRight: 12,
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { 
  useGetUserProfileQuery, 
  useUpdateUserPreferencesMutation 
} from '../../../api/user.api';

export const SettingsScreen = () => {
  const { theme, setMode, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // RTK Queries & Mutations
  const { data: profileResponse, isLoading, refetch } = useGetUserProfileQuery();
  const [updatePreferences, { isLoading: isSyncing }] = useUpdateUserPreferencesMutation();

  const profile = profileResponse?.data;
  const preferences = profile?.preferences;

  // Retrieve notification preferences with secure fallback options
  const pushEnabled = preferences?.notifications?.push ?? true;
  const emailEnabled = preferences?.notifications?.email ?? false;
  const smsEnabled = preferences?.notifications?.sms ?? false;
  const currentLanguage = preferences?.language ?? 'en';
  const currentTheme = preferences?.theme ?? (isDark ? 'dark' : 'light');

  // Toggle notification channel state helper
  const handleToggleNotification = async (channel: 'push' | 'email' | 'sms', value: boolean) => {
    try {
      const updatedNotifications = {
        push: channel === 'push' ? value : pushEnabled,
        email: channel === 'email' ? value : emailEnabled,
        sms: channel === 'sms' ? value : smsEnabled,
      };

      // Push preference change optimistically to the backend database
      await updatePreferences({
        notifications: updatedNotifications,
      }).unwrap();
    } catch (err: any) {
      console.error('[SettingsScreen] Toggle preference failed:', err);
      Alert.alert('Sync Failed', 'Failed to update notification settings. Please check your network.');
    }
  };

  // Toggle dark/light theme switch
  const handleToggleTheme = async (isDarkMode: boolean) => {
    try {
      // Toggle local react context theme
      setMode(isDarkMode ? 'dark' : 'light');

      // Synchronize theme choice inside MongoDB preferences
      await updatePreferences({
        theme: isDarkMode ? 'dark' : 'light',
      }).unwrap();
    } catch (err) {
      console.error('[SettingsScreen] Theme sync failed:', err);
    }
  };


  // Resolve language title display
  const getLanguageName = (code: string) => {
    switch (code) {
      case 'hi': return 'Hindi (🇮🇳)';
      case 'ar': return 'Arabic (🇸🇦)';
      case 'fr': return 'French (🇫🇷)';
      default: return 'English (🇺🇸)';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        {isSyncing || isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 10 }} />
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section 1: Push Channels & UI Preferences */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>APP CONFIGURATION</Text>
        
        {/* Dark Mode Switch */}
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
              <Ionicons name="moon-outline" size={20} color="#FFC107" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
          </View>
          <Switch 
            value={currentTheme === 'dark'} 
            onValueChange={handleToggleTheme}
            trackColor={{ false: '#CCCCCC', true: theme.colors.primary }}
            thumbColor={Platform.OS === 'android' ? '#F4F3F4' : undefined}
          />
        </View>

        {/* Language Selection Row */}
        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('ChangeLanguage')}
        >
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Ionicons name="globe-outline" size={20} color="#4CAF50" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Language</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={[styles.languageValue, { color: theme.colors.textSecondary }]}>
              {getLanguageName(currentLanguage)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Section 2: Notification Toggle Switches */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>NOTIFICATIONS CHANNELS</Text>
        
        {/* Push notifications switch */}
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(107, 78, 255, 0.1)' }]}>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Push Notifications</Text>
          </View>
          <Switch 
            value={pushEnabled} 
            onValueChange={(val) => handleToggleNotification('push', val)}
            trackColor={{ false: '#CCCCCC', true: theme.colors.primary }}
          />
        </View>

        {/* Email Switch */}
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
              <Ionicons name="mail-outline" size={20} color="#2196F3" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Email Notifications</Text>
          </View>
          <Switch 
            value={emailEnabled} 
            onValueChange={(val) => handleToggleNotification('email', val)}
            trackColor={{ false: '#CCCCCC', true: theme.colors.primary }}
          />
        </View>

        {/* SMS Switch */}
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 150, 136, 0.1)' }]}>
              <Ionicons name="phone-portrait-outline" size={20} color="#009688" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>SMS Notifications</Text>
          </View>
          <Switch 
            value={smsEnabled} 
            onValueChange={(val) => handleToggleNotification('sms', val)}
            trackColor={{ false: '#CCCCCC', true: theme.colors.primary }}
          />
        </View>

        {/* Section 3: Core Account & Legal Screens */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>ACCOUNT & SECURITY</Text>

        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(233, 30, 99, 0.1)' }]}>
              <Ionicons name="key-outline" size={20} color="#E91E63" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(96, 125, 139, 0.1)' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#607D8B" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('ContactUs')}
        >
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 188, 212, 0.1)' }]}>
              <Ionicons name="headset-outline" size={20} color="#00BCD4" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Contact Us</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('DeleteAccount')}
        >
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.danger }]}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: 0.8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  languageValue: {
    fontSize: 14,
  },
});

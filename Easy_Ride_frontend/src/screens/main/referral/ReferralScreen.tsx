import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Clipboard, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useGetUserProfileQuery } from '../../../api/user.api';

export const ReferralScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // Fetch dynamic user profile data
  const { data: profileResponse, isLoading } = useGetUserProfileQuery();
  const profile = profileResponse?.data;

  // Generate a premium dynamic referral code based on passenger profile
  const referralCode = profile?.fullName
    ? (profile.fullName.split(' ')[0] + (profile._id || '2026').slice(-4)).toUpperCase()
    : 'EASYRIDE20';

  // Copy referral code to clipboard
  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert(
      'Copied!', 
      `Referral code "${referralCode}" copied to clipboard. Share it with your friends to earn rewards!`,
      [{ text: 'OK' }]
    );
  };

  // Launch native sharing dialog
  const handleInviteShare = async () => {
    try {
      const shareMessage = `Hey! Join me on Easy Ride for extremely comfortable and fast travel. Use my referral code: ${referralCode} to claim a $20 discount on your first trip! 🚗💨\nDownload the app here: https://easyride.com/download`;
      
      const result = await Share.share({
        message: shareMessage,
        title: 'Join Easy Ride!',
      });
      
      if (result.action === Share.sharedAction) {
        console.log('[Referral] Link shared successfully');
      }
    } catch (err: any) {
      console.error('[Referral] Share error:', err);
      Alert.alert('Error', 'Unable to initiate sharing right now.');
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Referral</Text>
        <View style={{ width: 60 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Ionicons name="gift-outline" size={100} color={theme.colors.primary} />
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>
            Refer a Friend & Earn $20
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Share the comfort of Easy Ride with your family and friends. When they complete their first ride, you get $20 credited straight to your wallet.
          </Text>
          
          <View style={[styles.codeContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View>
              <Text style={[styles.codeLabel, { color: theme.colors.textSecondary }]}>YOUR REFERRAL CODE</Text>
              <Text style={[styles.codeText, { color: theme.colors.text }]}>{referralCode}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.copyBtn, { backgroundColor: theme.colors.primary + '1A' }]}
              onPress={handleCopyCode}
            >
              <Ionicons name="copy-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <AppButton 
              title="Invite Friends Now" 
              onPress={handleInviteShare} 
            />
          </View>
        </View>
      )}
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
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(107, 78, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xxl,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 72,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  copyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    marginTop: spacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

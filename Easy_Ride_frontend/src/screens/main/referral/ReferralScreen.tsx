import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const ReferralScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const referralCode = 'RkMFucd';

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

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Refer a friend and Earn $20</Text>
        
        <View style={[styles.codeContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          <Text style={[styles.codeText, { color: theme.colors.text }]}>{referralCode}</Text>
          <TouchableOpacity>
            <Ionicons name="copy-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <AppButton title="Invite" onPress={() => {}} />
        </View>
      </View>
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
    paddingTop: spacing.xl,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xxl,
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: spacing.md,
  },
});

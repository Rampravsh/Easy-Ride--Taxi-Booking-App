import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const ProfileScreen = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('nate@email.com');
  const [phone, setPhone] = useState('91');
  const [address, setAddress] = useState('Address');
  const [gender, setGender] = useState('Male');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: theme.colors.primary + '33' }]}>
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture */}
          <View style={styles.profilePicContainer}>
            <View style={[styles.avatarWrapper, { borderColor: theme.colors.primary }]}>
              <Image
                source={require('../../../../assets/images/user_avatar.png')}
                style={styles.avatar}
              />
              <TouchableOpacity style={[styles.editIcon, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                <Ionicons name="camera" size={12} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userName, { color: theme.colors.text }]}>Nate Samson</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.phoneRow, { borderColor: theme.colors.border }]}>
              <TouchableOpacity style={styles.countrySelector}>
                <Image
                  source={{ uri: 'https://flagcdn.com/w40/in.png' }}
                  style={styles.flag}
                />
                <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.phonePrefix, { color: theme.colors.text }]}>+{phone}</Text>
              <TextInput
                style={[styles.phoneInput, { color: theme.colors.text }]}
                placeholder="your mobile number"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity style={[styles.input, styles.dropdown, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Text style={[styles.dropdownText, { color: theme.colors.text }]}>{gender}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Address"
                placeholderTextColor={theme.colors.textSecondary}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton title="Update" onPress={() => { }} />
        </View>
      </KeyboardAvoidingView>
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
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    marginHorizontal: spacing.md,
  },
  phonePrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
});

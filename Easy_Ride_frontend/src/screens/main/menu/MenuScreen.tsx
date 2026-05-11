import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  { id: 'edit_profile', title: 'Edit Profile', icon: 'person-outline', screen: 'Profile' },
  { id: 'address', title: 'Address', icon: 'location-outline', screen: 'Address' },
  { id: 'history', title: 'History', icon: 'time-outline', screen: 'History' },
  { id: 'complain', title: 'Complain', icon: 'alert-circle-outline', screen: 'Complain' },
  { id: 'referral', title: 'Referral', icon: 'share-social-outline', screen: 'Referral' },
  { id: 'about_us', title: 'About Us', icon: 'information-circle-outline', screen: 'AboutUs' },
  { id: 'settings', title: 'Settings', icon: 'settings-outline', screen: 'Tabs' },
  { id: 'help', title: 'Help and Support', icon: 'help-circle-outline', screen: 'Tabs' },
  { id: 'logout', title: 'Logout', icon: 'log-out-outline', screen: 'SignIn', isLogout: true },
];

export const MenuScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      {/* Semi-transparent background */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={() => navigation.goBack()}
      />

      <View style={[styles.drawer, { backgroundColor: theme.colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { borderColor: theme.colors.primary }]}>
              <Image 
                source={require('../../../../assets/images/user_avatar.png')} 
                style={styles.avatar} 
              />
              <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>Nate Samson</Text>
              <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>nate@email.com</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.menuList}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  if (item.isLogout) {
                     // Handle logout logic
                     navigation.navigate('SignIn');
                  } else {
                     navigation.navigate(item.screen);
                  }
                }}
              >
                <Ionicons name={item.icon as any} size={22} color={theme.colors.textSecondary} />
                <Text style={[styles.menuItemText, { color: theme.colors.text }]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawer: {
    width: width * 0.75,
    height: '100%',
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  backText: {
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  profileSection: {
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    padding: 3,
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: spacing.md,
  },
});

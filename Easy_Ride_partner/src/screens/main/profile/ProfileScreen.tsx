import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { ProfileHeader } from '../../../components/profile/ProfileHeader';
import { RatingCard } from '../../../components/profile/RatingCard';
import { VehicleInfoCard } from '../../../components/profile/VehicleInfoCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // Simulated operational statistics
  const driverName = 'Rampravesh Kumar';
  const driverPhone = '+91 88265 99310';
  const isVerified = true;

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Easy Ride Partner platform?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // In a real application, clear session and dispatch to Auth
            Alert.alert('Session Ended', 'You have been successfully logged out.');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.appBar, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.appBarTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Operational Account
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Notifications')} 
          style={[styles.bellBtn, { backgroundColor: theme.colors.surface }]}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <ProfileHeader
          name={driverName}
          phone={driverPhone}
          verified={isVerified}
        />

        <View style={styles.section}>
          {/* Rating Summary Card */}
          <RatingCard
            rating={4.88}
            totalTrips={432}
            fiveStarPercent={0.94}
          />

          {/* Vehicle Information details */}
          <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Active Vehicle
          </Text>
          <VehicleInfoCard
            category="cab"
            model="Maruti Suzuki WagonR"
            numberPlate="DL 1CA 1234"
            color="White"
          />
        </View>

        {/* Action Panel Menu */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, paddingHorizontal: 16 }]}>
            Operational Control
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => {
              navigation.navigate('Documents');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(245,184,0,0.1)' }]}>
                <Ionicons name="document-text" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
                Verification & Compliance Docs
              </Text>
            </View>
            <View style={styles.menuRight}>
              <View style={[styles.greenDot, { backgroundColor: theme.colors.success }]} />
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => {
              navigation.navigate('SafetyCenter');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(255,69,58,0.1)' }]}>
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.danger} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
                Safety Center & Live SOS
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => {
              navigation.navigate('Support');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#007AFF" />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
                Help, Disputes, & Support Hub
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBg, { backgroundColor: 'rgba(229,57,53,0.1)' }]}>
                <Ionicons name="log-out" size={20} color={theme.colors.danger} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.danger, fontFamily: theme.typography.fontFamily.medium }]}>
                Log Out Account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 20,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
export default ProfileScreen;

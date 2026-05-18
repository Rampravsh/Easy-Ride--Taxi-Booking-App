import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

export const AboutUsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const appVersion = 'v2.4.0-production';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>About Us</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Icon / Logo Placeholder */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoOutline, { borderColor: theme.colors.primary }]}>
            <Ionicons name="car-sport" size={60} color={theme.colors.primary} />
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>Easy Ride</Text>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>{appVersion}</Text>
        </View>

        {/* Company Mission Statement */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Our Mission</Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          Easy Ride is a state-of-the-art urban mobility platform built to make transportation safe, reliable, and accessible to everyone. We merge high-performance mapping technologies with dynamic scheduling and seamless payments to deliver the premium ridesharing experience you deserve.
        </Text>

        {/* Core Pillars */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Our Core Values</Text>
        
        <View style={[styles.pillarCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.pillarIcon, { backgroundColor: theme.colors.primary + '1A' }]}>
            <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.pillarContent}>
            <Text style={[styles.pillarTitle, { color: theme.colors.text }]}>Uncompromising Safety</Text>
            <Text style={[styles.pillarText, { color: theme.colors.textSecondary }]}>
              Every driver is vetted thoroughly. We provide real-time tracking, secure OTP verification, and direct distress channels to protect you at all times.
            </Text>
          </View>
        </View>

        <View style={[styles.pillarCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.pillarIcon, { backgroundColor: theme.colors.primary + '1A' }]}>
            <Ionicons name="time" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.pillarContent}>
            <Text style={[styles.pillarTitle, { color: theme.colors.text }]}>Absolute Dependability</Text>
            <Text style={[styles.pillarText, { color: theme.colors.textSecondary }]}>
              No more endless waiting. Our advanced algorithms locate the closest driver dynamically to ensure rapid pickup and accurate route estimations.
            </Text>
          </View>
        </View>

        <View style={[styles.pillarCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.pillarIcon, { backgroundColor: theme.colors.primary + '1A' }]}>
            <Ionicons name="heart" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.pillarContent}>
            <Text style={[styles.pillarTitle, { color: theme.colors.text }]}>Inclusive & Equitable</Text>
            <Text style={[styles.pillarText, { color: theme.colors.textSecondary }]}>
              We maintain fair pricing structures for our riders and industry-leading commissions for our driver partners. We grow together.
            </Text>
          </View>
        </View>

        <View style={styles.footerSpacing} />
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  logoOutline: {
    width: 100,
    height: 100,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  pillarCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  pillarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  pillarContent: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  pillarText: {
    fontSize: 12,
    lineHeight: 18,
  },
  footerSpacing: {
    height: 50,
  },
});

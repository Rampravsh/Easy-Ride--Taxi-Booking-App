import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const ThankYouScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.successBadge, { backgroundColor: theme.colors.primary + '1A' }]}>
           <View style={[styles.successCircle, { backgroundColor: theme.colors.primary }]}>
             <Ionicons name="checkmark" size={60} color="#FFFFFF" />
           </View>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>Thank you</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Your booking has been placed sent to Shafi Ahmed
        </Text>
      </View>

      <View style={styles.footer}>
        <AppButton 
          title="Confirm Ride" 
          onPress={() => navigation.navigate('Tabs' as any)} 
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successBadge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
});

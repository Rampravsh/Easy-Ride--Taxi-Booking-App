import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Reusable Core Components
import { RideFareSummary } from '../../../components/ride/RideFareSummary';
import { AppButton } from '../../../components/common/AppButton';

export const RideCompletedScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [rating, setRating] = useState(5);

  const handleNextRide = () => {
    // Jump straight back to home tabs dashboard!
    navigation.navigate('HomeTabs');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Animated Celebration Placeholder header */}
        <View style={styles.celebrationHeader}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.success + '20' }]}>
            <Ionicons name="checkmark-done-circle" size={80} color={theme.colors.success} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Trip Completed!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Payment has been securely processed and transferred.
          </Text>
        </View>

        {/* Dynamic Financial Invoicing Statement */}
        <RideFareSummary 
          baseFare="₹420.00" 
          surgeBonus="₹260.00" 
          tollFares="₹140.00" 
          totalEarnings="₹820.00" 
          paymentMode="ONLINE" 
        />

        {/* Passenger Ratings Card */}
        <View style={[styles.ratingCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.ratingTitle, { color: theme.colors.text }]}>Rate Passenger Ramprakash</Text>
          
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={36} 
                  color={star <= rating ? theme.colors.primary : theme.colors.textSecondary} 
                  style={{ marginHorizontal: 6 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.ratingStatusText, { color: theme.colors.textSecondary }]}>
            {rating === 5 ? 'Excellent Passenger!' : rating >= 4 ? 'Good Passenger' : 'Average Passenger'}
          </Text>
        </View>

        <View style={{ height: 24 }} />

        {/* Primary next trip CTA action */}
        <AppButton 
          title="Back to Active Map Dashboard" 
          variant="primary" 
          onPress={handleNextRide} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  ratingCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingStatusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
export default RideCompletedScreen;

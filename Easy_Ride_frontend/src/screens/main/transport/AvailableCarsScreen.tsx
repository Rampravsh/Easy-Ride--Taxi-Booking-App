import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const CARS = [
  { id: '1', name: 'BMW Cabrio', type: 'Automatic | 3 seats | octane', distance: '800m (5mins away)', price: '$20/hr' },
  { id: '2', name: 'Mustang Shelby GT', type: 'Automatic | 2 seats | octane', distance: '1.2km (8mins away)', price: '$35/hr' },
  { id: '3', name: 'BMW i8', type: 'Automatic | 2 seats | Electric', distance: '2.5km (12mins away)', price: '$40/hr' },
  { id: '4', name: 'Jaguar F-Type', type: 'Automatic | 2 seats | octane', distance: '3.0km (15mins away)', price: '$45/hr' },
];

export const AvailableCarsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const renderCarItem = ({ item }: { item: typeof CARS[0] }) => (
    <View style={[styles.carCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.carInfo}>
        <View style={styles.textDetails}>
          <Text style={[styles.carName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.carType, { color: theme.colors.textSecondary }]}>{item.type}</Text>
          <View style={styles.distanceRow}>
             <Ionicons name="location" size={14} color={theme.colors.primary} />
             <Text style={[styles.distanceText, { color: theme.colors.textSecondary }]}>{item.distance}</Text>
          </View>
        </View>
        <Ionicons name="car-sport" size={60} color={theme.colors.border} />
      </View>
      <View style={styles.buttonRow}>
         <AppButton 
           title="Book later" 
           onPress={() => {}} 
           variant="outline" 
           style={styles.actionButton}
           textStyle={{ fontSize: 14 }}
         />
         <AppButton 
           title="Ride Now" 
           onPress={() => navigation.navigate('CarDetails', { carId: item.id })} 
           style={styles.actionButton}
           textStyle={{ fontSize: 14 }}
         />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Available cars for ride" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={[styles.countText, { color: theme.colors.textSecondary }]}>18 cars found</Text>
        <FlatList
          data={CARS}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: spacing.lg,
  },
  countText: {
    fontSize: 14,
    marginVertical: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  carCard: {
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  carInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  textDetails: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  carType: {
    fontSize: 12,
    marginBottom: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 44,
  },
});

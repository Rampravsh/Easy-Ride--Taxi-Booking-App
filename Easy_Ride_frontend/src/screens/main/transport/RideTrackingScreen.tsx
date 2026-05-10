import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const { width, height } = Dimensions.get('window');

import { Ride, Driver, Car } from '../../../types';

const MOCK_RIDE: Ride = {
  id: 'R123',
  car: {
    id: 'C1',
    name: 'Mustang Shelby GT',
    type: 'Transport',
    image: require('../../../../assets/images/red_mustang.png'),
    rating: 4.9,
    reviews: 531,
    pricePerHour: 200,
  },
  driver: {
    id: 'D1',
    name: 'Sergio Ramasis',
    avatar: require('../../../../assets/images/driver_sergio.png'),
    rating: 4.9,
    totalReviews: 531,
    status: 'available',
  },
  pickupLocation: '2972 Westheimer Rd.',
  destinationLocation: '1901 Thornridge Cir.',
  distance: '800m',
  duration: '3:35',
  status: 'ongoing',
  charges: {
    baseFare: 200,
    vat: 20,
    promoDiscount: 0,
    total: 220,
  },
  paymentMethod: {
    id: 'P1',
    label: '**** **** **** 8970',
    type: 'Visa',
  }
};

export const RideTrackingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const ride = MOCK_RIDE;
  const driver = ride.driver!;
  const car = ride.car;

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <Image 
        source={require('../../../../assets/images/map_placeholder.png')}
        style={styles.map}
        resizeMode="cover"
      />

      {/* Header Buttons */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="menu" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.white }]}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Car on Map - Simplified representation */}
      <View style={styles.carMarkerContainer}>
         {/* Route Line - SVG or View based simplified route */}
         <View style={[styles.routeLine, { backgroundColor: theme.colors.primary }]} />
         <Ionicons name="car" size={32} color={theme.colors.danger} style={styles.carIcon} />
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.colors.background }]}>
        <View style={styles.handle} />
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.statusText, { color: theme.colors.text }]}>
          Your driver is coming in <Text style={{ fontWeight: 'bold' }}>{ride.duration}</Text>
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.driverInfo}>
          <Image 
            source={driver.avatar}
            style={styles.driverAvatar}
          />
          <View style={styles.driverDetails}>
            <Text style={[styles.driverName, { color: theme.colors.text }]}>{driver.name}</Text>
            <View style={styles.driverStats}>
               <Ionicons name="location" size={12} color={theme.colors.textSecondary} />
               <Text style={[styles.driverSubText, { color: theme.colors.textSecondary }]}> {ride.distance} (5 mins away)</Text>
            </View>
            <View style={styles.driverStats}>
               <Ionicons name="star" size={12} color={theme.colors.primary} />
               <Text style={[styles.driverSubText, { color: theme.colors.textSecondary }]}> {driver.rating} ({driver.totalReviews} reviews)</Text>
            </View>
          </View>
          <Image 
            source={car.image}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.paymentSection}>
          <Text style={[styles.paymentTitle, { color: theme.colors.textSecondary }]}>Payment method</Text>
          <Text style={[styles.paymentValue, { color: theme.colors.text }]}>${ride.charges.total.toFixed(2)}</Text>
        </View>

        <View style={[styles.paymentCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
          <View style={styles.visaContainer}>
            <Text style={styles.visaText}>{ride.paymentMethod.type.toUpperCase()}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardLabel, { color: theme.colors.text }]}>{ride.paymentMethod.label}</Text>
            <Text style={[styles.cardExpiry, { color: theme.colors.textSecondary }]}>Expires: 12/26</Text>
          </View>
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: theme.colors.primary, borderWidth: 1 }]}
            onPress={() => navigation.navigate('Calling' as any)}
          >
            <Ionicons name="call" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: theme.colors.primary, borderWidth: 1 }]}
            onPress={() => navigation.navigate('Chat' as any)}
          >
            <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.6,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carMarkerContainer: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.4,
    alignItems: 'center',
  },
  routeLine: {
    width: 4,
    height: 100,
    borderRadius: 2,
    transform: [{ rotate: '20deg' }],
    opacity: 0.8,
  },
  carIcon: {
    marginTop: -10,
    transform: [{ rotate: '110deg' }],
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  driverDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  driverSubText: {
    fontSize: 12,
  },
  carImage: {
    width: 100,
    height: 60,
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paymentTitle: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  visaContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  visaText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardInfo: {
    marginLeft: spacing.md,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardExpiry: {
    fontSize: 12,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

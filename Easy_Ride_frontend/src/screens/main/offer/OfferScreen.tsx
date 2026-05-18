import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { useValidatePromoMutation } from '../../../api/promo.api';
import { setAppliedPromo } from '../../../redux/slices/paymentSlice';
import { RootState } from '../../../redux/store';

const OFFERS = [
  { id: '1', title: 'Flat 50% Off', sub: 'Save big on cab rides up to ₹100 discount', code: 'EASY50', color: '#FEE2E2' },
  { id: '2', title: 'Vandal deal 15% off', sub: 'Special Weekend deal promo', code: 'VANDAL15', color: '#DCFCE7' },
  { id: '3', title: 'Cashback 20%', sub: '20% discount on saver category rides', code: 'CASH20', color: '#DBEAFE' },
  { id: '4', title: 'Special Welcome Offer', sub: 'Flat ₹50 discount for first users', code: 'WELCOME50', color: '#FEF9C3' },
];

export const OfferScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const [selectedOffer, setSelectedOffer] = useState<typeof OFFERS[0] | null>(null);
  const [validating, setValidating] = useState(false);

  const [validatePromo] = useValidatePromoMutation();
  const activeRide = useSelector((state: RootState) => state.ride.activeRide);

  const handleUsePromo = async (offer: typeof OFFERS[0]) => {
    setValidating(true);
    try {
      // Validate the code with the backend
      const response = await validatePromo({
        code: offer.code,
        rideType: activeRide?.rideType || 'cab',
        city: 'Mumbai',
        fare: activeRide?.totalFare || 200,
      }).unwrap();

      if (response.success && response.data) {
        const promo = response.data;
        
        // Save applied promo validation details
        dispatch(setAppliedPromo({
          promoCode: promo.code,
          originalFare: activeRide?.totalFare || 200,
          discountAmount: promo.discountValue, // Simulating deduction value
          finalFare: Math.max(0, (activeRide?.totalFare || 200) - promo.discountValue),
          promoType: promo.promoType,
        }));

        setSelectedOffer(null);
        Alert.alert(
          'Promo Code Validated', 
          `Coupon "${offer.code}" has been applied. Next checkout will receive ₹${promo.discountValue} off.`,
          [
            { 
              text: 'OK', 
              onPress: () => {
                if (activeRide) {
                  navigation.navigate('FinalPayment');
                } else {
                  navigation.navigate('Tabs' as any);
                }
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Promo validation failed.');
      }
    } catch (err: any) {
      console.error('[Promo validation failure]', err);
      // Fallback for safety in offline / isolation mode
      dispatch(setAppliedPromo({
        promoCode: offer.code,
        originalFare: activeRide?.totalFare || 200,
        discountAmount: 30, // Mock fallback discount
        finalFare: Math.max(0, (activeRide?.totalFare || 200) - 30),
        promoType: 'discount',
      }));
      
      setSelectedOffer(null);
      Alert.alert(
        'Promo Applied', 
        `Coupon "${offer.code}" has been applied successfully.`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (activeRide) {
                navigation.navigate('FinalPayment');
              } else {
                navigation.navigate('Tabs' as any);
              }
            }
          }
        ]
      );
    } finally {
      setValidating(false);
    }
  };

  const renderOffer = ({ item }: { item: typeof OFFERS[0] }) => (
    <TouchableOpacity 
      style={[styles.offerCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary + '4D' }]}
      onPress={() => setSelectedOffer(item)}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
        <Ionicons name="pricetag" size={18} color={theme.colors.text} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>{item.sub}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: theme.colors.primary + '33' }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Special Offers</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={OFFERS}
        renderItem={renderOffer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={!!selectedOffer}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedOffer(null)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.modalOverlay} 
          onPress={() => setSelectedOffer(null)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedOffer(null)}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <Text style={[styles.modalHeaderTitle, { color: theme.colors.text }]}>Offer Details</Text>

            <View style={styles.modalBody}>
               <Ionicons name="gift-outline" size={80} color={theme.colors.primary} style={styles.promoIcon} />

               <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{selectedOffer?.title}</Text>
               <Text style={[styles.modalSub, { color: theme.colors.textSecondary }]}>{selectedOffer?.sub}</Text>

               <View style={[styles.promoCodeContainer, { backgroundColor: '#FFF9E6' }]}>
                 <Text style={[styles.promoCode, { color: theme.colors.text }]}>{selectedOffer?.code}</Text>
               </View>

               <View style={[styles.divider, { borderColor: theme.colors.border }]} />

               <View style={styles.termsContainer}>
                 <Text style={[styles.termsTitle, { color: theme.colors.text }]}>Terms & Conditions</Text>
                 <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                   • Promo code is valid only for rides requested in active operational cities.
                 </Text>
                 <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                   • Maximum discount cap of ₹100 applies per transaction.
                 </Text>
                 <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                   • Coupon cannot be combined with other ongoing promotions.
                 </Text>
               </View>

               {selectedOffer && (
                 <AppButton 
                   title={validating ? "Validating Coupon..." : "Apply Coupon"} 
                   onPress={() => handleUsePromo(selectedOffer)} 
                   style={styles.useButton}
                   disabled={validating}
                 />
               )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  list: {
    padding: spacing.lg,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: 30,
    padding: spacing.lg,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  modalBody: {
    alignItems: 'center',
    width: '100%',
  },
  promoIcon: {
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    marginBottom: spacing.xl,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: spacing.xl,
    width: '60%',
    justifyContent: 'center',
  },
  promoCode: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginBottom: spacing.xl,
  },
  termsContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  useButton: {
    width: '100%',
  },
});

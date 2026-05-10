import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const OFFERS = [
  { id: '1', title: 'Discount 15% off', sub: 'Special Promo valid for Black Friday', code: 'DISC15', color: '#FEE2E2' },
  { id: '2', title: 'Special 5% off', sub: 'Special weekend deal promo', code: 'WEEK5', color: '#DCFCE7' },
  { id: '3', title: 'Cashback 15%', sub: 'Special Promo valid for today', code: 'CASH15', color: '#DBEAFE' },
  { id: '4', title: 'Special 15% off', sub: 'Special Promo valid for Black Friday', code: 'SPECIAL15', color: '#FEF9C3' },
  { id: '5', title: 'Discount 15% off', sub: 'Special Promo valid for Black Friday', code: 'DISC15B', color: '#F3F4F6' },
  { id: '6', title: 'Discount 15% off', sub: 'Special Promo valid for Black Friday', code: 'DISC15C', color: '#DCFCE7' },
];

export const OfferScreen = () => {
  const { theme } = useTheme();
  const [selectedOffer, setSelectedOffer] = useState<typeof OFFERS[0] | null>(null);

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
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: theme.colors.primary + '33' }]}>
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Special Offer</Text>
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

            <Text style={[styles.modalHeaderTitle, { color: theme.colors.text }]}>Special Offer</Text>

            <View style={styles.modalBody}>
               <Image 
                 source={require('../../../../assets/images/special_offer_tag.png')}
                 style={styles.promoImage}
                 resizeMode="contain"
               />

               <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{selectedOffer?.title}</Text>
               <Text style={[styles.modalSub, { color: theme.colors.textSecondary }]}>{selectedOffer?.sub}</Text>

               <View style={[styles.promoCodeContainer, { backgroundColor: '#FFF9E6' }]}>
                 <Text style={[styles.promoCode, { color: theme.colors.text }]}>{selectedOffer?.code}</Text>
                 <TouchableOpacity>
                   <Ionicons name="copy-outline" size={20} color={theme.colors.textSecondary} />
                 </TouchableOpacity>
               </View>

               <View style={[styles.divider, { borderColor: theme.colors.border }]} />

               <View style={styles.termsContainer}>
                 <Text style={[styles.termsTitle, { color: theme.colors.text }]}>Terms and Conditions</Text>
                 <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                   • Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                 </Text>
                 <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                   • Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                 </Text>
                 <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                   • Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.
                 </Text>
               </View>

               <AppButton 
                 title="Use Promo" 
                 onPress={() => setSelectedOffer(null)} 
                 style={styles.useButton}
               />
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
  promoImage: {
    width: 140,
    height: 140,
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
    marginRight: spacing.md,
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

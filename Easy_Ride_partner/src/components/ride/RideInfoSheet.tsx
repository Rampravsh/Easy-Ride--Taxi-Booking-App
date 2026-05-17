import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideInfoSheetProps {
  paymentMode: 'CASH' | 'WALLET' | 'ONLINE';
  fareAmount: string;
  tollCharges?: string;
  taxAmount?: string;
  totalCollected: string;
  notes?: string;
}

export const RideInfoSheet: React.FC<RideInfoSheetProps> = ({
  paymentMode,
  fareAmount,
  tollCharges = '₹0.00',
  taxAmount = '₹0.00',
  totalCollected,
  notes,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Payment Summary</Text>
        <View 
          style={[
            styles.paymentModeBadge, 
            { 
              backgroundColor: paymentMode === 'CASH' ? 'rgba(229, 57, 53, 0.15)' : 'rgba(76, 175, 80, 0.15)',
              borderColor: paymentMode === 'CASH' ? theme.colors.danger : theme.colors.success,
            }
          ]}
        >
          <Ionicons 
            name={paymentMode === 'CASH' ? 'cash-outline' : 'card-outline'} 
            size={12} 
            color={paymentMode === 'CASH' ? theme.colors.danger : theme.colors.success} 
            style={{ marginRight: 4 }}
          />
          <Text 
            style={[
              styles.paymentModeText, 
              { color: paymentMode === 'CASH' ? theme.colors.danger : theme.colors.success }
            ]}
          >
            {paymentMode}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.billingRows}>
        <View style={styles.billingRow}>
          <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Base Fare</Text>
          <Text style={[styles.billValue, { color: theme.colors.text }]}>{fareAmount}</Text>
        </View>
        <View style={styles.billingRow}>
          <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Tolls / Parking</Text>
          <Text style={[styles.billValue, { color: theme.colors.text }]}>{tollCharges}</Text>
        </View>
        <View style={styles.billingRow}>
          <Text style={[styles.billLabel, { color: theme.colors.textSecondary }]}>Taxes & Fees</Text>
          <Text style={[styles.billValue, { color: theme.colors.text }]}>{taxAmount}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Earnings</Text>
        <Text style={[styles.totalValue, { color: theme.colors.primary }]}>{totalCollected}</Text>
      </View>

      {notes && (
        <View style={[styles.notesContainer, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.notesText, { color: theme.colors.textSecondary }]}>{notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  paymentModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  paymentModeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  billingRows: {
    marginBottom: 8,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  notesText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
});
export default RideInfoSheet;

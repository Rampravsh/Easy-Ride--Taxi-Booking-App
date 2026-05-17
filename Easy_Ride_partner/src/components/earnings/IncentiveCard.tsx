import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface IncentiveCardProps {
  title: string;
  description: string;
  bonusAmount: string;
  progressText: string;
  progressPercent: number; // 0 to 1
}

export const IncentiveCard: React.FC<IncentiveCardProps> = ({
  title,
  description,
  bonusAmount,
  progressText,
  progressPercent,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 184, 0, 0.15)' }]}>
          <Ionicons name="gift" size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.desc, { color: theme.colors.textSecondary }]} numberOfLines={2}>{description}</Text>
        </View>
        <Text style={[styles.bonus, { color: theme.colors.primary }]}>{bonusAmount}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Progress</Text>
          <Text style={[styles.progressVal, { color: theme.colors.text }]}>{progressText}</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { backgroundColor: theme.colors.primary, width: `${Math.min(100, progressPercent * 100)}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  desc: {
    fontSize: 11,
    lineHeight: 14,
  },
  bonus: {
    fontSize: 16,
    fontWeight: '900',
  },
  progressContainer: {
    width: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
export default IncentiveCard;

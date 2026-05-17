import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface VehicleInfoCardProps {
  category: 'bike' | 'auto' | 'cab';
  model: string;
  numberPlate: string;
  color: string;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({
  category,
  model,
  numberPlate,
  color,
}) => {
  const { theme } = useTheme();

  const getCategoryIcon = () => {
    switch (category) {
      case 'bike':
        return 'bicycle';
      case 'auto':
        return 'car-sport-outline';
      case 'cab':
      default:
        return 'car';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name={getCategoryIcon()} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.model, { color: theme.colors.text }]}>{model}</Text>
          <Text style={[styles.colorText, { color: theme.colors.textSecondary }]}>{color} • {category.toUpperCase()}</Text>
        </View>
      </View>
      <View style={[styles.plateContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.plateText, { color: theme.colors.text }]}>{numberPlate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    marginLeft: 12,
    flex: 1,
  },
  model: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  plateContainer: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
export default VehicleInfoCard;

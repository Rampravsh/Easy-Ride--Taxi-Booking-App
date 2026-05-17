import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideActionFooterProps {
  actionText: string;
  onPressAction: () => void;
  onSOS: () => void;
  isLoading?: boolean;
}

export const RideActionFooter: React.FC<RideActionFooterProps> = ({
  actionText,
  onPressAction,
  onSOS,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
      <TouchableOpacity 
        style={[styles.sosButton, { backgroundColor: theme.colors.danger }]} 
        onPress={onSOS}
      >
        <Ionicons name="shield" size={24} color={theme.colors.white} />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
        onPress={onPressAction}
        disabled={isLoading}
      >
        <Text style={styles.actionBtnText}>
          {isLoading ? 'Processing...' : actionText}
        </Text>
        <Ionicons name="chevron-forward-circle" size={24} color="#111111" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    justifyContent: 'space-between',
  },
  sosButton: {
    width: 64,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 2,
  },
  actionBtn: {
    flex: 1,
    marginLeft: 16,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
});
export default RideActionFooter;

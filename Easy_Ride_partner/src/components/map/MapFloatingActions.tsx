import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface MapFloatingActionsProps {
  onSOSPress: () => void;
  onRecenterPress: () => void;
  onSupportPress?: () => void;
}

export const MapFloatingActions = ({
  onSOSPress,
  onRecenterPress,
  onSupportPress,
}: MapFloatingActionsProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.sosButton, { backgroundColor: theme.colors.danger }]} 
        onPress={onSOSPress}
        activeOpacity={0.8}
      >
        <Ionicons name="alert-circle" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {onSupportPress && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} 
          onPress={onSupportPress}
          activeOpacity={0.8}
        >
          <Ionicons name="help-buoy" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} 
        onPress={onRecenterPress}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={22} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    zIndex: 8,
  },
  sosButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
export default MapFloatingActions;

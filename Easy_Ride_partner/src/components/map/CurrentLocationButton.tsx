import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface CurrentLocationButtonProps {
  onPress: () => void;
  bottomOffset?: number;
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onPress,
  bottomOffset = 240,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: theme.colors.card, 
          borderColor: theme.colors.border,
          bottom: bottomOffset,
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="locate" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 25,
    zIndex: 10,
  },
});
export default CurrentLocationButton;

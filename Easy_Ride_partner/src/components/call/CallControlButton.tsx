import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface CallControlButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  isDanger?: boolean;
}

export const CallControlButton: React.FC<CallControlButtonProps> = ({
  icon,
  label,
  onPress,
  isActive = false,
  isDanger = false,
}) => {
  const { theme } = useTheme();

  const getBgColor = () => {
    if (isDanger) return theme.colors.danger;
    if (isActive) return theme.colors.white;
    return 'rgba(255, 255, 255, 0.15)';
  };

  const getIconColor = () => {
    if (isDanger) return theme.colors.white;
    if (isActive) return theme.colors.black;
    return theme.colors.white;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: getBgColor(),
            borderColor: isActive ? theme.colors.primary : 'transparent',
            borderWidth: isActive ? 2 : 0,
          },
        ]}
        activeOpacity={0.8}
      >
        <Ionicons name={icon as any} size={28} color={getIconColor()} />
      </TouchableOpacity>
      <Text style={[styles.label, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginVertical: 12,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
});

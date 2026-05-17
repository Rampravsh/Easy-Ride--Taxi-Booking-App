import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface OnlineStatusBadgeProps {
  isOnline: boolean;
}

export const OnlineStatusBadge: React.FC<OnlineStatusBadgeProps> = ({ isOnline }) => {
  const { theme } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: isOnline ? 'rgba(76, 175, 80, 0.15)' : 'rgba(107, 114, 128, 0.15)',
          borderColor: isOnline ? theme.colors.success : theme.colors.textSecondary,
        }
      ]}
    >
      <View 
        style={[
          styles.dot, 
          { backgroundColor: isOnline ? theme.colors.success : theme.colors.textSecondary }
        ]} 
      />
      <Text 
        style={[
          styles.label, 
          { color: isOnline ? theme.colors.success : theme.colors.textSecondary }
        ]}
      >
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
export default OnlineStatusBadge;

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface UnreadBadgeProps {
  count: number;
  style?: StyleProp<ViewStyle>;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count, style }) => {
  const { theme } = useTheme();

  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View 
      style={[
        styles.badge, 
        { 
          backgroundColor: theme.colors.danger,
          borderColor: theme.colors.background,
        },
        style
      ]}
    >
      <Text 
        style={[
          styles.text, 
          { 
            color: theme.colors.white,
            fontFamily: theme.typography.fontFamily.bold,
          }
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 10,
    lineHeight: 11,
    textAlign: 'center',
  },
});

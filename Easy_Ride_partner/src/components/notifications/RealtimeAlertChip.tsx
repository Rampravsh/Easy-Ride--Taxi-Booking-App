import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';

interface RealtimeAlertChipProps {
  status: 'connected' | 'connecting' | 'alert';
  label?: string;
}

export const RealtimeAlertChip: React.FC<RealtimeAlertChipProps> = ({
  status = 'connected',
  label,
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          color: theme.colors.primary,
          text: label || 'Connecting...',
        };
      case 'alert':
        return {
          color: theme.colors.danger,
          text: label || 'System Alert',
        };
      default:
        return {
          color: theme.colors.success,
          text: label || 'Realtime Active',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.chip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: config.color,
            opacity: pulseAnim,
          },
        ]}
      />
      <Text style={[styles.text, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 11,
  },
});

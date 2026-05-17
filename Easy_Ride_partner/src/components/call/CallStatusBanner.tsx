import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface CallStatusBannerProps {
  customerName: string;
  duration: string;
  onPress: () => void;
}

export const CallStatusBanner: React.FC<CallStatusBannerProps> = ({
  customerName,
  duration,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.banner, { backgroundColor: theme.colors.success }]}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Ionicons name="call" size={18} color={theme.colors.white} style={styles.pulseIcon} />
        <Text style={[styles.text, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.semiBold }]}>
          Active Call with {customerName}
        </Text>
      </View>
      <Text style={[styles.timer, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold }]}>
        {duration}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseIcon: {
    marginRight: 4,
  },
  text: {
    fontSize: 14,
  },
  timer: {
    fontSize: 14,
  },
});

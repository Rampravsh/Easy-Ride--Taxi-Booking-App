import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideNavigationPanelProps {
  instructionText: string;
  turnDistance: string;
  nextActionIcon: string; // e.g. "arrow-turn-up-right", "arrow-up"
  roadName?: string;
}

export const RideNavigationPanel = ({
  instructionText,
  turnDistance,
  nextActionIcon,
  roadName = 'KIA Road Express highway',
}: RideNavigationPanelProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
      <View style={styles.leftCol}>
        <View style={[styles.arrowContainer, { backgroundColor: theme.colors.success }]}>
          <Ionicons name={nextActionIcon as any} size={28} color="#111111" />
        </View>
        <Text style={styles.distanceText}>{turnDistance}</Text>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.instructionText} numberOfLines={2}>
          {instructionText}
        </Text>
        <Text style={styles.roadText} numberOfLines={1}>
          {roadName}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 14,
  },
  arrowContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rightCol: {
    flex: 1,
    justifyContent: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  roadText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
export default RideNavigationPanel;

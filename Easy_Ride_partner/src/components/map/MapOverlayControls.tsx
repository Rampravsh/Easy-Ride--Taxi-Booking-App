import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface MapOverlayControlsProps {
  onPressCompass?: () => void;
  onPressTraffic?: () => void;
  onPressLayer?: () => void;
  isTrafficActive?: boolean;
}

export const MapOverlayControls: React.FC<MapOverlayControlsProps> = ({
  onPressCompass,
  onPressTraffic,
  onPressLayer,
  isTrafficActive = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} 
        onPress={onPressCompass}
      >
        <Ionicons name="compass" size={22} color={theme.colors.text} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.button, 
          { 
            backgroundColor: isTrafficActive ? theme.colors.primary : theme.colors.card, 
            borderColor: theme.colors.border,
            marginTop: 10,
          }
        ]} 
        onPress={onPressTraffic}
      >
        <Ionicons 
          name="navigate" 
          size={22} 
          color={isTrafficActive ? '#111111' : theme.colors.text} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, marginTop: 10 }]} 
        onPress={onPressLayer}
      >
        <Ionicons name="layers" size={22} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: 100,
    zIndex: 10,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
export default MapOverlayControls;

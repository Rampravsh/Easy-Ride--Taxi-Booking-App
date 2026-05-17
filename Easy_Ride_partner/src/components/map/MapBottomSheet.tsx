import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useTheme } from '../../theme';

interface MapBottomSheetProps {
  children: React.ReactNode;
  height?: number;
}

const { height: screenHeight } = Dimensions.get('window');

export const MapBottomSheet: React.FC<MapBottomSheetProps> = ({
  children,
  height = screenHeight * 0.35,
}) => {
  const { theme } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          height,
          backgroundColor: theme.colors.card, 
          borderTopColor: theme.colors.border,
          shadowColor: '#000',
        }
      ]}
    >
      <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    paddingTop: 12,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 24,
    zIndex: 9,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
export default MapBottomSheet;

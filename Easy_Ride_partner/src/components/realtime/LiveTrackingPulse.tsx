import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface LiveTrackingPulseProps {
  isActive: boolean;
  color?: string;
}

export const LiveTrackingPulse = ({
  isActive,
  color,
}: LiveTrackingPulseProps) => {
  const { theme } = useTheme();
  const ringAnim1 = useRef(new Animated.Value(0)).current;
  const ringAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(ringAnim1, {
              toValue: 1,
              duration: 1600,
              useNativeDriver: true,
            }),
            Animated.timing(ringAnim1, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(800),
            Animated.timing(ringAnim2, {
              toValue: 1,
              duration: 1600,
              useNativeDriver: true,
            }),
            Animated.timing(ringAnim2, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      ringAnim1.setValue(0);
      ringAnim2.setValue(0);
    }
  }, [isActive]);

  const activeColor = color || theme.colors.primary;

  const scaleStyle1 = ringAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.4],
  });

  const opacityStyle1 = ringAnim1.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.4, 0.2, 0],
  });

  const scaleStyle2 = ringAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.4],
  });

  const opacityStyle2 = ringAnim2.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.4, 0.2, 0],
  });

  return (
    <View style={styles.container}>
      {isActive && (
        <>
          <Animated.View style={[
            styles.ring,
            { 
              borderColor: activeColor,
              transform: [{ scale: scaleStyle1 }],
              opacity: opacityStyle1
            }
          ]} />
          <Animated.View style={[
            styles.ring,
            { 
              borderColor: activeColor,
              transform: [{ scale: scaleStyle2 }],
              opacity: opacityStyle2
            }
          ]} />
        </>
      )}
      <View style={[styles.dot, { backgroundColor: activeColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  ring: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
});
export default LiveTrackingPulse;

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';

interface RealtimePulseProps {
  active?: boolean;
  color?: string;
  size?: number;
}

export const RealtimePulse: React.FC<RealtimePulseProps> = ({ 
  active = true, 
  color, 
  size = 64 
}) => {
  const { theme } = useTheme();
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  
  const pulseColor = color || theme.colors.primary;

  useEffect(() => {
    if (!active) {
      pulseAnim1.setValue(0);
      pulseAnim2.setValue(0);
      return;
    }

    const animatePulse = () => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(pulseAnim1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim2, {
            toValue: 1,
            duration: 2000,
            delay: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animatePulse();
  }, [active]);

  const scale1 = pulseAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });

  const opacity1 = pulseAnim1.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.5, 0.3, 0],
  });

  const scale2 = pulseAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });

  const opacity2 = pulseAnim2.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0.5, 0.3, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {active && (
        <>
          <Animated.View 
            style={[
              styles.pulse, 
              { 
                width: size, 
                height: size, 
                borderRadius: size / 2, 
                backgroundColor: pulseColor,
                transform: [{ scale: scale1 }],
                opacity: opacity1,
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.pulse, 
              { 
                width: size, 
                height: size, 
                borderRadius: size / 2, 
                backgroundColor: pulseColor,
                transform: [{ scale: scale2 }],
                opacity: opacity2,
              }
            ]} 
          />
        </>
      )}
      <View 
        style={[
          styles.core, 
          { 
            width: size * 0.4, 
            height: size * 0.4, 
            borderRadius: (size * 0.4) / 2, 
            backgroundColor: pulseColor,
            borderColor: theme.colors.white,
            borderWidth: 2,
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
  },
  core: {
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
export default RealtimePulse;

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export const TypingIndicator: React.FC = () => {
  const { theme } = useTheme();
  
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.delay(400),
        ])
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 200);
    const anim3 = animateDot(dot3, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  const getDotStyle = (animValue: Animated.Value) => {
    return [
      styles.dot,
      {
        backgroundColor: theme.colors.primary,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -6],
            }),
          },
        ],
      },
    ];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Animated.View style={getDotStyle(dot1)} />
      <Animated.View style={getDotStyle(dot2)} />
      <Animated.View style={getDotStyle(dot3)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginVertical: 4,
    height: 36,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

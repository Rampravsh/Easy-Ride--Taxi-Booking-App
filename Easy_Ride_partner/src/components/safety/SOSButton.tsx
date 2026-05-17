import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SOSButtonProps {
  onTriggerSOS: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onTriggerSOS }) => {
  const { theme } = useTheme();
  
  const [pressActive, setPressActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const pulseScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation loop
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulse.start();
    return () => pulse.stop();
  }, [pulseScale]);

  // Press progress monitoring
  useEffect(() => {
    let timer: any;
    if (pressActive) {
      // Progress bar fill animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onTriggerSOS();
            setPressActive(false);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setCountdown(3);
    }

    return () => {
      clearInterval(timer);
    };
  }, [pressActive, progressAnim, onTriggerSOS]);

  const handlePressIn = () => {
    setPressActive(true);
  };

  const handlePressOut = () => {
    setPressActive(false);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={styles.buttonWrapper}>
          {/* Animated pulse ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                backgroundColor: theme.colors.danger,
                transform: [{ scale: pressActive ? 1.3 : pulseScale }],
                opacity: pressActive ? 0.6 : 0.25,
              },
            ]}
          />
          
          <View style={[styles.mainButton, { backgroundColor: theme.colors.danger }]}>
            {pressActive ? (
              <View style={styles.countdownContainer}>
                <Text style={[styles.countdownText, { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.white }]}>
                  {countdown}
                </Text>
                <Text style={[styles.holdText, { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.white }]}>
                  HOLD
                </Text>
              </View>
            ) : (
              <View style={styles.idleContainer}>
                <Ionicons name="alert-circle" size={48} color={theme.colors.white} />
                <Text style={[styles.sosText, { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.white }]}>
                  SOS
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Progress tracker under the button */}
      <View style={[styles.trackBar, { backgroundColor: theme.colors.border }]}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.colors.danger, 
              width: progressWidth 
            }
          ]} 
        />
      </View>
      <Text style={[styles.instructions, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
        {pressActive ? 'Keep holding to alert dispatch & local authorities' : 'Press & hold for 3 seconds to trigger emergency SOS'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  mainButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 2,
  },
  idleContainer: {
    alignItems: 'center',
  },
  sosText: {
    fontSize: 22,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 42,
    lineHeight: 48,
  },
  holdText: {
    fontSize: 12,
    opacity: 0.8,
  },
  trackBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 16,
  },
});

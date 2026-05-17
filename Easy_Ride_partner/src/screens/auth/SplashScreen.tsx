import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

export const SplashScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding1');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        alignItems: 'center'
      }}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={[styles.appName, { color: theme.colors.secondary }]}>
          EASY RIDE
        </Text>
        <Text style={[styles.partnerTag, { color: theme.colors.secondary, opacity: 0.7 }]}>
          PARTNER
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.loadingText, { color: theme.colors.secondary }]}>
          Connecting you to riders...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  partnerTag: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 5,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
  }
});

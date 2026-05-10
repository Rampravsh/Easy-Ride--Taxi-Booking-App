import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography } from '../../theme';

export const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Splash'>>();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding1');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/images/logo_icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.title}>RideGo</Text>
      </View>
      <View style={styles.loaderContainer}>
        {/* Using a custom looking loader approximation from the screenshot */}
        <ActivityIndicator size="large" color={theme.colors.white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  logoContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 100,
  },
});

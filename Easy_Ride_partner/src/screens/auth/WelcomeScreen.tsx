import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AppButton } from '../../components/common/AppButton';

import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import { TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Welcome'>>();
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Drive & Earn with Easy Ride
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Become a professional partner today. Enjoy flexible hours, competitive earnings, and 24/7 dedicated support.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>24/7</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Support</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>Weekly</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Payouts</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>Zero</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Commitment</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Start Driving"
            variant="primary"
            onPress={() => navigation.navigate('PhoneLogin')}
          />
          <View style={styles.footerSpacing} />
          <AppButton
            title="Already a Partner? Sign In"
            variant="outline"
            onPress={() => navigation.navigate('SignIn')}
          />
          <TouchableOpacity 
            onPress={() => {
              dispatch(setCredentials({ 
                token: 'mock-session-token', 
                user: { name: 'John Doe', email: 'johndoe@example.com', role: 'partner' } 
              }));
            }}
            style={{ marginTop: 16, alignItems: 'center' }}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.colors.primary, fontWeight: '800', fontSize: 13, letterSpacing: 0.5 }}>
              SKIP TO HOME (DEV MODE)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 140,
    height: 140,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 24,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 24,
  },
  footerSpacing: {
    height: 12,
  },
});

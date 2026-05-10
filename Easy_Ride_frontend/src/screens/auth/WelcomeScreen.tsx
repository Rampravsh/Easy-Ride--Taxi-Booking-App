import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';

export const WelcomeScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Welcome'>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/onboarding3.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.colors.text }]}>Welcome</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Have a better sharing experience
        </Text>
      </View>
      
      <View style={styles.footer}>
        <AppButton 
          title="Create an account" 
          onPress={() => navigation.navigate('SignUp')} 
          style={styles.button}
        />
        <AppButton 
          title="Log in" 
          variant="outline" 
          onPress={() => navigation.navigate('SignIn')} 
        />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  button: {
    marginBottom: spacing.md,
  },
});

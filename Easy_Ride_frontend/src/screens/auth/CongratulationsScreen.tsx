import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export const CongratulationsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Congratulations'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Congratulations'>>();
  const { title, message, nextScreen } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, you might use navigation.reset or navigate to Main
      console.log(`Redirecting to ${nextScreen}`);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.iconContainer, { backgroundColor: '#E6F4FE' }]}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
        
        <View style={styles.loaderContainer}>
           <Image 
             source={require('../../../assets/images/logo_icon.png')} 
             style={[styles.logo, { tintColor: theme.colors.primary }]}
             resizeMode="contain"
           />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modal: {
    width: '100%',
    borderRadius: 24,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  loaderContainer: {
    marginTop: spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
  }
});

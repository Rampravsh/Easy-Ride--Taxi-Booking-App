import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';

export const Onboarding1Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <OnboardingLayout
      image={require('../../../assets/images/onboarding_earnings.png')}
      title="Earn on your terms"
      description="Flexible hours and competitive earnings with every ride you complete."
      onNext={() => navigation.navigate('Onboarding2')}
      onSkip={() => navigation.navigate('Welcome')}
      isLast={false}
    />
  );
};

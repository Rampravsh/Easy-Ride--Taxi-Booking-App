import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';

export const Onboarding1Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Onboarding1'>>();

  return (
    <OnboardingLayout
      image={require('../../../assets/images/onboarding1.png')}
      title="Anywhere you are"
      description="We provide best taxi booking service for you"
      onNext={() => navigation.navigate('Onboarding2')}
      onSkip={() => navigation.navigate('EnableLocation')}
    />
  );
};

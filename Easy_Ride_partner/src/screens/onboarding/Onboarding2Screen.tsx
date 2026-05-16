import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';

export const Onboarding2Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <OnboardingLayout
      image={require('../../../assets/images/onboarding_navigation.png')}
      title="Smart Navigation"
      description="Optimized routes and real-time traffic updates to save your time and fuel."
      onNext={() => navigation.navigate('Onboarding3')}
      onSkip={() => navigation.navigate('Welcome')}
      isLast={false}
    />
  );
};

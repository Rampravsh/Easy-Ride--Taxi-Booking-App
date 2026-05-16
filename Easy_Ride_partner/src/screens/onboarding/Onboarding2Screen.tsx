import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';

export const Onboarding2Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <OnboardingLayout
      title="Smart Navigation"
      description="Optimized routes to save time and maximize your trips."
      onNext={() => navigation.navigate('Onboarding3')}
      onSkip={() => navigation.navigate('Welcome')}
      isLast={false}
    />
  );
};

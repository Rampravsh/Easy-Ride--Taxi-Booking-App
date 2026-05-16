import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';

export const Onboarding3Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <OnboardingLayout
      image={require('../../../assets/images/onboarding_safety.png')}
      title="Safety & Support"
      description="Enjoy peace of mind with 24/7 in-app support and real-time safety monitoring."
      onNext={() => navigation.navigate('Welcome')}
      onSkip={() => navigation.navigate('Welcome')}
      isLast={true}
    />
  );
};

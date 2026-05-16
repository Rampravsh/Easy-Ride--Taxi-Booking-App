import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';

export const Onboarding3Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <OnboardingLayout
      title="Safety & Support"
      description="24/7 support and secure driving experience for every partner."
      onNext={() => navigation.navigate('Welcome')}
      onSkip={() => navigation.navigate('Welcome')}
      isLast={true}
    />
  );
};

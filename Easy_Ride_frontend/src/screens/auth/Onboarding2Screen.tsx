import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';

export const Onboarding2Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Onboarding2'>>();

  return (
    <OnboardingLayout
      image={require('../../../assets/images/onboarding2.png')}
      title="At anytime"
      description="Sell houses easily with the help of Listenoryx and to make this line big I am writing more."
      onNext={() => navigation.navigate('Onboarding3')}
      onSkip={() => navigation.replace('Login')}
    />
  );
};

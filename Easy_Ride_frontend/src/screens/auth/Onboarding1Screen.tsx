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
      description="Sell houses easily with the help of Listenoryx and to make this line big I am writing more."
      onNext={() => navigation.navigate('Onboarding2')}
      onSkip={() => navigation.replace('Login')}
    />
  );
};

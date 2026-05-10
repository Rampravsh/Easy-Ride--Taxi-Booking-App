import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { OnboardingLayout } from '../../components/OnboardingLayout';

export const Onboarding3Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Onboarding3'>>();

  return (
    <OnboardingLayout
      image={require('../../../assets/images/onboarding3.png')}
      title="Book your car"
      description="Sell houses easily with the help of Listenoryx and to make this line big I am writing more."
      onNext={() => navigation.replace('Login')}
      onSkip={() => navigation.replace('Login')}
      isLast={true}
    />
  );
};

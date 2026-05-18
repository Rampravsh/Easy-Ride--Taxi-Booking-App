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
      description="Safe, comfortable, and affordable rides at your doorstep."
      onNext={() => navigation.navigate('EnableLocation')}
      onSkip={() => navigation.navigate('EnableLocation')}
      isLast={true}
    />
  );
};

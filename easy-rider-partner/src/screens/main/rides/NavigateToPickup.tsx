import React from 'react';
import { View, Text } from 'react-native';
import { RideLifecycleBase } from '../../../components/ride/RideLifecycleBase';
import { useNavigation } from '@react-navigation/native';

const NavigateToPickup = () => {
  const navigation = useNavigation<any>();

  return (
    <RideLifecycleBase
      title="Picking up Rider"
      buttonText="I HAVE ARRIVED"
      onButtonPress={() => navigation.navigate('Arrived')}
      riderInfo={{
        name: "Alex Johnson",
        rating: 4.9,
        pickup: "123 Tech Avenue, Silicon Valley",
        dropoff: "International Airport, Terminal 2"
      }}
    >
      <View className="mb-8 flex-row justify-between bg-yellow-50 p-4 rounded-2xl">
        <View>
          <Text className="text-primary font-bold">4 min away</Text>
          <Text className="text-gray-600 text-sm">1.2 miles to pickup</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-500 text-sm">Traffic</Text>
          <Text className="text-green-600 font-bold text-sm">Light</Text>
        </View>
      </View>
    </RideLifecycleBase>
  );
};

export default NavigateToPickup;

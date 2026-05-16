import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { Phone, MessageSquare, Shield, ChevronLeft } from 'lucide-react-native';

interface RideLifecycleProps {
  title: string;
  buttonText: string;
  onButtonPress: () => void;
  riderInfo: {
    name: string;
    rating: number;
    pickup: string;
    dropoff: string;
  };
  children?: React.ReactNode;
}

export const RideLifecycleBase: React.FC<RideLifecycleProps> = ({
  title,
  buttonText,
  onButtonPress,
  riderInfo,
  children
}) => {
  return (
    <View className="flex-1 bg-white">
      <MapView
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />

      <SafeAreaView className="absolute top-0 left-0 right-0 p-4">
        <View className="flex-row items-center">
          <TouchableOpacity className="bg-white p-3 rounded-full shadow-md">
            <ChevronLeft size={24} color="#111111" />
          </TouchableOpacity>
          <View className="flex-1 ml-4 bg-white/90 p-3 rounded-2xl shadow-sm">
            <Text className="text-black font-bold text-lg text-center">{title}</Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl">
        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mt-3 mb-6" />
        
        <View className="px-6 pb-10">
          {/* Rider Details */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-gray-100 rounded-full mr-4 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-400">{riderInfo.name[0]}</Text>
              </View>
              <View>
                <Text className="text-black font-bold text-xl">{riderInfo.name}</Text>
                <View className="flex-row items-center">
                  <Star size={14} color="#F5B800" fill="#F5B800" />
                  <Text className="text-gray-500 font-medium ml-1">{riderInfo.rating} • Cash</Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-blue-50 p-4 rounded-2xl">
                <MessageSquare size={24} color="#1565C0" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-green-50 p-4 rounded-2xl">
                <Phone size={24} color="#2E7D32" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Address Summary */}
          <View className="mb-8">
            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Pickup Location</Text>
            <Text className="text-black text-lg font-semibold" numberOfLines={1}>{riderInfo.pickup}</Text>
          </View>

          {children}

          {/* Action Button */}
          <View className="flex-row gap-4">
            <TouchableOpacity className="bg-red-50 p-6 rounded-2xl items-center justify-center">
              <Shield size={24} color="#E53935" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onButtonPress}
              className="flex-1 bg-black py-6 rounded-2xl items-center shadow-lg"
            >
              <Text className="text-white font-bold text-xl uppercase tracking-widest">{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const Star = ({ size, color, fill }: { size: number; color: string; fill: string }) => (
  <View style={{ width: size, height: size, backgroundColor: fill, borderRadius: size/2 }} />
);

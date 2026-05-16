import React from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { MapPin, Navigation, Star, Clock, ChevronRight } from 'lucide-react-native';

interface RideRequestProps {
  visible: boolean;
  request: {
    pickup: string;
    dropoff: string;
    fare: string;
    distance: string;
    eta: string;
    riderName: string;
    riderRating: number;
  };
  onAccept: () => void;
  onReject: () => void;
}

export const RideRequestModal: React.FC<RideRequestProps> = ({ 
  visible, 
  request, 
  onAccept, 
  onReject 
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-[40px] p-8 shadow-2xl">
          <View className="flex-row justify-between items-center mb-8">
            <View className="bg-yellow-100 px-4 py-2 rounded-full">
              <Text className="text-primary font-bold text-lg">NEW RIDE</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={20} color="#6B7280" />
              <Text className="text-gray-500 font-bold ml-2 text-lg">15s</Text>
            </View>
          </View>

          {/* Fare & Distance */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-gray-500 text-sm font-medium uppercase tracking-widest">Est. Fare</Text>
              <Text className="text-4xl font-bold text-black">{request.fare}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm font-medium uppercase tracking-widest">Trip Distance</Text>
              <Text className="text-2xl font-bold text-black">{request.distance}</Text>
            </View>
          </View>

          {/* Locations */}
          <View className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
            <View className="flex-row items-center mb-6">
              <View className="w-4 h-4 rounded-full border-2 border-primary bg-white mr-4" />
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-bold uppercase">Pickup</Text>
                <Text className="text-black text-lg font-semibold" numberOfLines={1}>{request.pickup}</Text>
              </View>
              <Text className="text-primary font-bold">{request.eta}</Text>
            </View>
            
            <View className="w-[1px] h-6 bg-gray-200 ml-2 mb-2" />

            <View className="flex-row items-center">
              <MapPin size={18} color="#E53935" className="mr-4" />
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-bold uppercase">Dropoff</Text>
                <Text className="text-black text-lg font-semibold" numberOfLines={1}>{request.dropoff}</Text>
              </View>
            </View>
          </View>

          {/* Rider Info */}
          <View className="flex-row items-center justify-between mb-10 bg-gray-50 p-4 rounded-2xl">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-200 rounded-full mr-4 items-center justify-center">
                <Text className="text-xl font-bold text-gray-500">{request.riderName[0]}</Text>
              </View>
              <View>
                <Text className="text-black font-bold text-lg">{request.riderName}</Text>
                <View className="flex-row items-center">
                  <Star size={14} color="#F5B800" fill="#F5B800" />
                  <Text className="text-gray-500 font-medium ml-1">{request.riderRating}</Text>
                </View>
              </View>
            </View>
            <ChevronRight size={24} color="#D1D5DB" />
          </View>

          {/* Actions */}
          <View className="flex-row gap-4 mb-4">
            <TouchableOpacity 
              onPress={onReject}
              className="flex-1 bg-gray-100 py-6 rounded-2xl items-center"
            >
              <Text className="text-gray-500 font-bold text-xl">Decline</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onAccept}
              className="flex-[2] bg-primary py-6 rounded-2xl items-center shadow-lg shadow-primary/30"
            >
              <Text className="text-white font-bold text-xl uppercase tracking-widest">Accept Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setOnlineStatus } from '../../../redux/slices/riderSlice';
import { Menu, Bell, Navigation, Zap, DollarSign, Activity } from 'lucide-react-native';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { isOnline, currentLocation } = useSelector((state: RootState) => state.rider);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const toggleOnline = () => {
    dispatch(setOnlineStatus(!isOnline));
  };

  return (
    <View className="flex-1 bg-white">
      {/* Fullscreen Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        region={mapRegion}
        showsUserLocation
        followsUserLocation
      >
        {/* Heatmap / Surge Zones Placeholder */}
      </MapView>

      {/* Top Header */}
      <SafeAreaView className="absolute top-0 left-0 right-0 p-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity className="bg-white p-3 rounded-full shadow-md">
            <Menu size={24} color="#111111" />
          </TouchableOpacity>
          
          {/* Online/Offline Toggle */}
          <TouchableOpacity 
            onPress={toggleOnline}
            className={`flex-row items-center px-6 py-3 rounded-full shadow-lg ${isOnline ? 'bg-rider-online' : 'bg-rider-offline'}`}
          >
            <View className={`w-3 h-3 rounded-full mr-2 bg-white ${isOnline ? 'opacity-100' : 'opacity-50'}`} />
            <Text className="text-white font-bold text-lg">
              {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white p-3 rounded-full shadow-md">
            <Bell size={24} color="#111111" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Floating Operational Cards */}
      <View className="absolute bottom-24 left-0 right-0 px-4 flex-row justify-between">
        <View className="bg-white p-4 rounded-2xl shadow-xl w-[48%] flex-row items-center">
          <View className="bg-blue-100 p-2 rounded-full mr-3">
            <DollarSign size={20} color="#1565C0" />
          </View>
          <View>
            <Text className="text-gray-500 text-xs font-medium">Earnings</Text>
            <Text className="text-black text-lg font-bold">$124.50</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl shadow-xl w-[48%] flex-row items-center">
          <View className="bg-orange-100 p-2 rounded-full mr-3">
            <Zap size={20} color="#FF9800" />
          </View>
          <View>
            <Text className="text-gray-500 text-xs font-medium">Surge</Text>
            <Text className="text-black text-lg font-bold">1.5x</Text>
          </View>
        </View>
      </View>

      {/* Bottom Status Sheet */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-[32px] shadow-2xl">
        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-500 text-sm">Status</Text>
            <Text className={`text-xl font-bold ${isOnline ? 'text-rider-online' : 'text-rider-offline'}`}>
              {isOnline ? 'Looking for rides...' : 'You are offline'}
            </Text>
          </View>
          <View className="bg-gray-100 px-4 py-2 rounded-full flex-row items-center">
            <Activity size={16} color="#6B7280" className="mr-2" />
            <Text className="text-gray-600 font-semibold">98% Rating</Text>
          </View>
        </View>

        {!isOnline && (
          <Text className="text-gray-400 text-center mb-2 italic">
            Go online to start receiving ride requests
          </Text>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowUpRight, TrendingUp, Calendar, Clock, DollarSign, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const EarningsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="mt-8 mb-10 flex-row justify-between items-end">
          <View>
            <Text className="text-gray-500 font-medium text-lg">Today's Earnings</Text>
            <Text className="text-5xl font-bold text-black mt-1">$142.00</Text>
          </View>
          <View className="bg-green-100 px-4 py-2 rounded-full flex-row items-center">
            <TrendingUp size={16} color="#2E7D32" />
            <Text className="text-green-700 font-bold ml-1">+12%</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row justify-between mb-10">
          <View className="bg-gray-50 p-6 rounded-[32px] w-[48%] items-center">
            <Clock size={24} color="#6B7280" />
            <Text className="text-gray-400 text-xs font-bold uppercase mt-3">Hours Online</Text>
            <Text className="text-black text-2xl font-bold mt-1">6.5</Text>
          </View>
          <View className="bg-gray-50 p-6 rounded-[32px] w-[48%] items-center">
            <TrendingUp size={24} color="#6B7280" />
            <Text className="text-gray-400 text-xs font-bold uppercase mt-3">Trips Made</Text>
            <Text className="text-black text-2xl font-bold mt-1">12</Text>
          </View>
        </View>

        {/* Weekly Chart Placeholder */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-black">Weekly Performance</Text>
            <TouchableOpacity className="flex-row items-center">
              <Calendar size={18} color="#F5B800" />
              <Text className="text-primary font-bold ml-1">This Week</Text>
            </TouchableOpacity>
          </View>
          
          <View className="h-48 bg-gray-50 rounded-[40px] flex-row items-end justify-between px-8 pb-6">
            {[40, 70, 45, 90, 65, 80, 50].map((val, i) => (
              <View 
                key={i} 
                style={{ height: `${val}%` }} 
                className={`w-3 rounded-full ${i === 3 ? 'bg-primary' : 'bg-gray-200'}`} 
              />
            ))}
          </View>
        </View>

        {/* Recent Trips */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-black">Recent Trips</Text>
            <TouchableOpacity>
              <Text className="text-primary font-bold">See All</Text>
            </TouchableOpacity>
          </View>

          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} className="flex-row items-center justify-between mb-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <View className="flex-row items-center">
                <View className="bg-yellow-50 p-3 rounded-2xl mr-4">
                  <DollarSign size={20} color="#F5B800" />
                </View>
                <View>
                  <Text className="text-black font-bold">Standard Ride</Text>
                  <Text className="text-gray-500 text-xs">Today, 2:45 PM</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-black font-bold">$12.50</Text>
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-xs font-medium">Completed</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EarningsScreen;

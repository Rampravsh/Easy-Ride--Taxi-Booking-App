import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const TRANSPORT_TYPES = [
  { id: 'car', name: 'Car', icon: 'car', color: '#FF5252' },
  { id: 'bike', name: 'Bike', icon: 'motorbike', color: '#448AFF' },
  { id: 'cycle', name: 'Cycle', icon: 'bicycle', color: '#333333' },
  { id: 'taxi', name: 'Taxi', icon: 'taxi', color: '#FFD700' },
];

export const SelectTransportScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedId, setSelectedId] = React.useState('car');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Select transport" onBack={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Select your transport</Text>
        
        <View style={styles.grid}>
          {TRANSPORT_TYPES.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.card, 
                  { backgroundColor: isSelected ? theme.colors.primary : theme.colors.card },
                  !isSelected && { borderWidth: 1, borderColor: theme.colors.border + '40' }
                ]}
                onPress={() => {
                  setSelectedId(item.id);
                  setTimeout(() => navigation.navigate('AvailableCars'), 300);
                }}
              >
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons 
                    name={item.icon as any} 
                    size={54} 
                    color={isSelected ? '#000000' : item.color} 
                  />
                </View>
                <Text style={[
                  styles.name, 
                  { color: isSelected ? '#000000' : theme.colors.text }
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});

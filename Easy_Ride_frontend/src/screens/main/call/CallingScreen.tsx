import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

import { Driver } from '../../../types';

const MOCK_DRIVER: Driver = {
  id: 'D1',
  name: 'Sergio Ramasis',
  avatar: require('../../../../assets/images/driver_sergio.png'),
  rating: 4.9,
  totalReviews: 531,
  status: 'available',
};

export const CallingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const driver = MOCK_DRIVER;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image 
            source={driver.avatar}
            style={styles.avatar}
          />
        </View>

        <Text style={[styles.name, { color: theme.colors.text }]}>{driver.name}</Text>
        <Text style={[styles.status, { color: theme.colors.textSecondary }]}>Calling...</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#FFF9E6' }]}>
            <Ionicons name="volume-high-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#FFF9E6' }]}>
            <Ionicons name="mic-off-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.callButton, { backgroundColor: theme.colors.success }]}
            onPress={() => navigation.navigate('Talk' as any)}
          >
            <Ionicons name="call" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#FFF9E6' }]}>
            <Ionicons name="videocam-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#FFF9E6' }]}>
            <Ionicons name="pause-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#F5B800',
    padding: 10,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
  },
  footer: {
    paddingBottom: 60,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { useDispatch } from 'react-redux';
import { setPickupLocation } from '../../redux/slices/rideSlice';
import { LocationService } from '../../services/location.service';

export const EnableLocationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'EnableLocation'>>();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUseLocation = async () => {
    setLoading(true);
    try {
      const location = await LocationService.getCurrentLocation();
      dispatch(
        setPickupLocation({
          address: location.address,
          coordinates: location.coordinates,
        })
      );
      navigation.navigate('Welcome');
    } catch (err) {
      console.error('[EnableLocationScreen] Failed to fetch current location:', err);
      navigation.navigate('Welcome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.card }]}>
          <Image 
            source={require('../../../assets/images/logo_icon.png')} 
            style={[styles.image, { tintColor: theme.colors.primary }]}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Enable your location</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Choose your location to start find the request around you
        </Text>
      </View>
      
      <View style={styles.footer}>
        <AppButton 
          title="Use my location" 
          onPress={handleUseLocation} 
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
        <AppButton 
          title="Skip for now" 
          variant="outline" 
          onPress={() => navigation.navigate('Welcome')} 
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  image: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  button: {
    marginBottom: spacing.md,
  },
});

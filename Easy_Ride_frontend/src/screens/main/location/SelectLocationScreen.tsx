import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { AppButton } from '../../../components/AppButton';

const RECENT_PLACES = [
  { id: '1', name: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', distance: '2.7km' },
  { id: '2', name: 'Coffee shop', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', distance: '1.5km' },
  { id: '3', name: 'Shopping center', address: '4517 Washington Ave. Manchester, Kentucky 39495', distance: '4.3km' },
  { id: '4', name: 'Shopping mall', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.8km' },
];

export const SelectLocationScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [fromLocation, setFromLocation] = useState('Current location');
  const [toLocation, setToLocation] = useState('');

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={isDark ? darkMapStyle : []}
      />

      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.background }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={[styles.bottomSheet, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Select address</Text>

        <View style={styles.inputsContainer}>
          <View style={styles.routeLineContainer}>
             <Ionicons name="radio-button-on" size={16} color={theme.colors.primary} />
             <View style={[styles.dashLine, { backgroundColor: theme.colors.border }]} />
             <Ionicons name="location" size={16} color="#FF5252" />
          </View>

          <View style={styles.inputs}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, borderWidth: 1 }]}>
               <TextInput 
                 style={[styles.input, { color: theme.colors.text }]}
                 value={fromLocation}
                 onChangeText={setFromLocation}
                 placeholder="From"
                 placeholderTextColor={theme.colors.textSecondary}
               />
               <Ionicons name="locate-outline" size={20} color={theme.colors.primary} />
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.card }]}>
               <TextInput 
                 style={[styles.input, { color: theme.colors.text }]}
                 value={toLocation}
                 onChangeText={setToLocation}
                 placeholder="To"
                 placeholderTextColor={theme.colors.textSecondary}
                 autoFocus
               />
            </View>
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={[styles.recentTitle, { color: theme.colors.text }]}>Recent places</Text>
          <ScrollView style={styles.recentList}>
            {RECENT_PLACES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.recentItem} onPress={() => setToLocation(item.name)}>
                <Ionicons name="location" size={20} color={theme.colors.textSecondary} />
                <View style={styles.recentInfo}>
                  <Text style={[styles.placeName, { color: theme.colors.text }]}>{item.name}</Text>
                  <Text style={[styles.placeAddress, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
                <Text style={[styles.distance, { color: theme.colors.textSecondary }]}>{item.distance}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <AppButton 
          title="Confirm Location" 
          onPress={() => navigation.goBack()} 
          style={styles.confirmButton}
        />
      </View>
    </View>
  );
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.lg,
    paddingBottom: 40,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  routeLineContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: 12,
  },
  dashLine: {
    width: 1,
    flex: 1,
    marginVertical: 4,
    borderStyle: 'dashed',
  },
  inputs: {
    flex: 1,
    gap: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  recentSection: {
    flex: 1,
    maxHeight: 250,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  recentList: {
    flex: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  recentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 12,
  },
  distance: {
    fontSize: 12,
  },
  confirmButton: {
    marginTop: spacing.lg,
  },
});

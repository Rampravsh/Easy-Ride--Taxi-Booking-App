import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation, setDestinationLocation } from '../../../redux/slices/rideSlice';
import { RootState } from '../../../redux/store';
import { LocationService } from '../../../services/location.service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

interface Place {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'recent' | 'result';
}

import { useGetUserProfileQuery } from '../../../api/user.api';

interface Place {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'recent' | 'result';
  coordinates?: [number, number];
}

export const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();
  
  const pickupLocation = useSelector((state: RootState) => state.ride.pickupLocation);
  
  // Fetch real saved addresses from profile
  const { data: profileData } = useGetUserProfileQuery();
  const savedAddresses = profileData?.data?.savedAddresses || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Map saved addresses to Place objects
  const recentPlaces: Place[] = savedAddresses.map((addr, idx) => ({
    id: addr._id || String(idx),
    name: addr.label,
    address: addr.address,
    distance: 'Saved Shortcut',
    type: 'recent',
    coordinates: addr.location?.coordinates,
  }));

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 1) {
      setHasSearched(true);
      setLoading(true);
      try {
        // Dynamic Address Geocoding Suggestion
        const geocoded = await LocationService.geocodeAddress(text);
        if (geocoded) {
          const matchedPlace: Place = {
            id: 'geo-suggest-1',
            name: text,
            address: geocoded.address,
            distance: 'Map match',
            type: 'result',
            coordinates: geocoded.coordinates,
          };
          setResults([matchedPlace]);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.warn('[SearchScreen] Typing geocode error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setHasSearched(false);
      setResults([]);
    }
  };

  const handleSelectPlace = async (place: Place) => {
    setLoading(true);
    try {
      let dropCoords = place.coordinates;
      let dropAddress = place.address;

      if (!dropCoords) {
        const dropResult = await LocationService.geocodeAddress(place.address);
        dropCoords = dropResult.coordinates;
        dropAddress = dropResult.address;
      }

      dispatch(
        setDestinationLocation({
          address: place.name ? `${place.name}, ${dropAddress}` : dropAddress,
          coordinates: dropCoords,
        })
      );

      // Initialize pickup if not set
      if (!pickupLocation) {
        const pickupResult = await LocationService.getCurrentLocation();
        dispatch(
          setPickupLocation({
            address: pickupResult.address,
            coordinates: pickupResult.coordinates,
          })
        );
      }

      // Proceed to map confirmation
      navigation.navigate('SelectLocation');
    } catch (err) {
      console.error('[SearchScreen] Selection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity 
      style={styles.placeItem}
      onPress={() => handleSelectPlace(item)}
      disabled={loading}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons 
          name={item.type === 'recent' ? "bookmark-outline" : "location-outline"} 
          size={20} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.placeInfo}>
        <Text style={[styles.placeName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.placeAddress, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
      <Text style={[styles.distance, { color: theme.colors.primary, fontWeight: '600' }]}>{item.distance}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Search destination"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            editable={!loading}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} disabled={loading}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.cancelButton}
          disabled={loading}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {loading && searchQuery.length > 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Searching locations...
          </Text>
        </View>
      ) : !hasSearched ? (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Saved & Recent Places</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Address')}>
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Manage</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentPlaces}
            renderItem={renderPlaceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="location-outline" size={48} color={theme.colors.border} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text, fontSize: 16, marginTop: 10 }]}>No Saved Places</Text>
                <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary, fontSize: 12 }]}>
                  Add Home, Work or Gym in settings to find them quickly.
                </Text>
              </View>
            }
          />
        </View>
      ) : results.length > 0 ? (
        <View style={styles.content}>
          <Text style={[styles.resultsLabel, { color: theme.colors.textSecondary }]}>
            Suggestions for <Text style={{ color: theme.colors.primary }}>"{searchQuery}"</Text>
          </Text>
          <FlatList
            data={results}
            renderItem={renderPlaceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={60} color={theme.colors.border} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Matches Found</Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            Unable to resolve coordinates. Try checking spelling or adding city names.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  cancelButton: {
    paddingHorizontal: spacing.xs,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resultsLabel: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 13,
  },
  distance: {
    fontSize: 12,
    marginLeft: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
  },
});

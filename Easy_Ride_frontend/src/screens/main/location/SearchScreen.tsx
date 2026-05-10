import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Place {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: 'recent' | 'result';
}

const RECENT_PLACES: Place[] = [
  { id: '1', name: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', distance: '2.7km', type: 'recent' },
  { id: '2', name: 'coffee shop', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', distance: '1.5km', type: 'recent' },
  { id: '3', name: 'Shopping center', address: '4517 Washington Ave. Manchester, Kentucky 39495', distance: '4.3km', type: 'recent' },
  { id: '4', name: 'Shopping mall', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.8km', type: 'recent' },
];

export const SearchScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setHasSearched(true);
      // Simulate search results
      if (text.toLowerCase() === 'shop') {
        setResults([
          { id: '1', name: 'Burger Shop', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', distance: '2.7km', type: 'result' },
          { id: '2', name: 'Shopping mall', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.0km', type: 'result' },
          { id: '3', name: 'Coffee Shop', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', distance: '1.1km', type: 'result' },
        ]);
      } else {
        setResults([]);
      }
    } else {
      setHasSearched(false);
      setResults([]);
    }
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity style={styles.placeItem}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons 
          name={item.type === 'recent' ? "time-outline" : "location-outline"} 
          size={20} 
          color={theme.colors.textSecondary} 
        />
      </View>
      <View style={styles.placeInfo}>
        <Text style={[styles.placeName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.placeAddress, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
      <Text style={[styles.distance, { color: theme.colors.textSecondary }]}>{item.distance}</Text>
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
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {!hasSearched ? (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent places</Text>
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary }}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={RECENT_PLACES}
            renderItem={renderPlaceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
      ) : results.length > 0 ? (
        <View style={styles.content}>
          <Text style={[styles.resultsLabel, { color: theme.colors.textSecondary }]}>
            Results for <Text style={{ color: theme.colors.primary }}>"{searchQuery}"</Text>
            {'   '}{results.length} found
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
          <Image 
            source={require('../../../../assets/images/not_found.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Not Found</Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
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
});

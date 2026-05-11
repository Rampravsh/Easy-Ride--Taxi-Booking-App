import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

const FAVOURITES = [
  { id: '1', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', icon: 'location' },
  { id: '2', title: 'Home', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', icon: 'location' },
  { id: '3', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', icon: 'location' },
  { id: '4', title: 'House', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', icon: 'location' },
  { id: '5', title: 'Home', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', icon: 'location' },
  { id: '6', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', icon: 'location' },
  { id: '7', title: 'House', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', icon: 'location' },
  { id: '8', title: 'House', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', icon: 'location' },
];

export const FavouriteScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const renderItem = ({ item }: { item: typeof FAVOURITES[0] }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.text + '0A' }]}>
        <Ionicons name="location" size={20} color={theme.colors.text} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.address, { color: theme.colors.textSecondary }]}>{item.address}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="remove-circle" size={24} color={theme.colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: theme.colors.primary + '33' }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Favourite</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={FAVOURITES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    lineHeight: 18,
  },
  deleteButton: {
    marginLeft: spacing.sm,
  },
});

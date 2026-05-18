import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { 
  useGetUserProfileQuery, 
  useAddUserAddressMutation, 
  useDeleteUserAddressMutation 
} from '../../../api/user.api';
import { SavedAddress } from '../../../types/user';

export const AddressScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState('');
  const [addressDetails, setAddressDetails] = useState('');

  // RTK Queries & Mutations
  const { data: profileResponse, isLoading, refetch } = useGetUserProfileQuery();
  const [addAddress, { isLoading: isAdding }] = useAddUserAddressMutation();
  const [deleteAddress] = useDeleteUserAddressMutation();

  const savedAddresses = profileResponse?.data?.savedAddresses || [];

  // Save new address record
  const handleSaveAddress = async () => {
    if (!label.trim()) {
      Alert.alert('Validation Error', 'Please enter a name for this address (e.g., Home, Work).');
      return;
    }
    if (!addressDetails.trim()) {
      Alert.alert('Validation Error', 'Please enter full address details.');
      return;
    }

    try {
      const response = await addAddress({
        label: label.trim(),
        address: addressDetails.trim(),
        coordinates: [0, 0], // Default coordinates
      }).unwrap();

      if (response.success) {
        Alert.alert('Success', 'New address saved successfully!');
        setLabel('');
        setAddressDetails('');
        setShowAddModal(false);
        refetch();
      }
    } catch (err: any) {
      console.error('[AddressScreen] Save failed:', err);
      Alert.alert('Save Failed', err.message || 'Failed to save address.');
    }
  };

  // Delete address shortcut
  const handleDeleteAddress = (id: string, name: string) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to remove "${name}" from your saved places?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Trigger the deletion in the database.
              // Note: The optimistic update will instantly purge this from the local screen view list.
              await deleteAddress(id).unwrap();
            } catch (err: any) {
              console.error('[AddressScreen] Delete failed:', err);
              Alert.alert('Error', 'Failed to remove address. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: SavedAddress }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '1A' }]}>
        <Ionicons 
          name={
            item.label.toLowerCase() === 'home' ? 'home-outline' :
            item.label.toLowerCase() === 'work' || item.label.toLowerCase() === 'office' ? 'briefcase-outline' :
            'location-outline'
          } 
          size={20} 
          color={theme.colors.primary} 
        />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.label}</Text>
        <Text style={[styles.address, { color: theme.colors.textSecondary }]}>{item.address}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => item._id && handleDeleteAddress(item._id, item.label)}
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Saved Places</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : savedAddresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={80} color={theme.colors.border} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No saved places yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Save frequently used addresses like Home, Office, or Gym for faster bookings.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedAddresses}
          renderItem={renderItem}
          keyExtractor={item => item._id || Math.random().toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <AppButton 
          title="Add New Address" 
          onPress={() => setShowAddModal(true)} 
          disabled={isLoading}
        />
      </View>

      {/* Add Address Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBlur} 
            activeOpacity={1} 
            onPress={() => !isAdding && setShowAddModal(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHandle} />
            <TouchableOpacity 
              style={styles.modalClose} 
              onPress={() => !isAdding && setShowAddModal(false)}
              disabled={isAdding}
            >
              <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add New Place</Text>

            <View style={styles.form}>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Ionicons name="bookmark-outline" size={20} color={theme.colors.textSecondary} />
                <TextInput 
                  style={[styles.input, { color: theme.colors.text }]} 
                  placeholder="Label (e.g., Home, Work, Gym)" 
                  placeholderTextColor={theme.colors.textSecondary}
                  value={label}
                  onChangeText={setLabel}
                  editable={!isAdding}
                />
              </View>

              <View style={[styles.inputWrapper, styles.multilineWrapper, { borderColor: theme.colors.border }]}>
                <Ionicons name="location-outline" size={20} color={theme.colors.textSecondary} style={{ marginTop: 12 }} />
                <TextInput 
                  style={[styles.input, styles.multilineInput, { color: theme.colors.text }]} 
                  placeholder="Full Address Details" 
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  value={addressDetails}
                  onChangeText={setAddressDetails}
                  editable={!isAdding}
                />
              </View>

              <AppButton 
                title="Save Address" 
                onPress={handleSaveAddress} 
                loading={isAdding}
                disabled={isAdding}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 8,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  modalHandle: {
    width: 60,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalClose: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  multilineWrapper: {
    height: 100,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  multilineInput: {
    height: '100%',
    paddingTop: 10,
    textAlignVertical: 'top',
  },
});

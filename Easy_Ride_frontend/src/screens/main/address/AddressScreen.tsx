import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const ADDRESSES = [
  { id: '1', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
  { id: '2', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
  { id: '3', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
  { id: '4', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
  { id: '5', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
  { id: '6', title: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
];

export const AddressScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [showAddModal, setShowAddModal] = useState(false);

  const renderItem = ({ item }: { item: typeof ADDRESSES[0] }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.text + '0A' }]}>
        <Ionicons name="location-outline" size={20} color={theme.colors.text} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.address, { color: theme.colors.textSecondary }]}>{item.address}</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={20} color={theme.colors.danger} />
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Address</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={ADDRESSES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <AppButton title="Add New Address" onPress={() => setShowAddModal(true)} />
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
            onPress={() => setShowAddModal(false)} 
          />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHandle} />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Address Details</Text>

            <View style={styles.form}>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Ionicons name="add-circle-outline" size={20} color={theme.colors.textSecondary} />
                <TextInput 
                  style={[styles.input, { color: theme.colors.text }]} 
                  placeholder="Name of Address" 
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <TextInput 
                  style={[styles.input, { color: theme.colors.text }]} 
                  placeholder="Address Details" 
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                />
              </View>

              <AppButton title="Save Address" onPress={() => setShowAddModal(false)} />
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
  editButton: {
    padding: 4,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
});

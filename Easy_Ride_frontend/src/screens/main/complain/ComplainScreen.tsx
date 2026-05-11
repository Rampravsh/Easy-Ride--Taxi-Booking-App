import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const ComplainScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [reason, setReason] = useState('Vehicle not clean');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Complain</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          <Text style={[styles.dropdownText, { color: theme.colors.text }]}>{reason}</Text>
          <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={[styles.textArea, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Write your complain here (minimum 10 characters)"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.footer}>
          <AppButton title="Submit" onPress={() => setShowSuccess(true)} />
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSuccess(false)}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.successIconContainer, { backgroundColor: theme.colors.success + '22' }]}>
              <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
            </View>

            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Send successful</Text>
            <Text style={[styles.modalSub, { color: theme.colors.textSecondary }]}>
              Your complain has been send successful
            </Text>

            <AppButton 
              title="Back Home" 
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Tabs');
              }} 
              style={styles.modalButton}
            />
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  dropdownText: {
    fontSize: 16,
  },
  textArea: {
    height: 150,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 14,
  },
  footer: {
    marginTop: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: 20,
  },
  modalButton: {
    width: '100%',
  },
});

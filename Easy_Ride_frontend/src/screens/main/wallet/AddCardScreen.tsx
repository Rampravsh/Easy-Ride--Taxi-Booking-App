import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const AddCardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add Card</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.selector, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
           <Text style={[styles.selectorText, { color: theme.colors.textSecondary }]}>Select Payment Method</Text>
           <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Account Number"
          placeholderTextColor={theme.colors.textSecondary}
          value={accountNumber}
          onChangeText={setAccountNumber}
        />

        <AppButton 
          title="Save Payment Method" 
          onPress={() => navigation.goBack()} 
          style={styles.saveButton}
        />

        <View style={styles.divider} />

        {/* List of saved methods - matching screenshot 40 */}
        <View style={[styles.methodCard, { borderColor: theme.colors.border }]}>
            <View style={[styles.methodIcon, { backgroundColor: '#717171' }]}>
               <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>VISA</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, { color: theme.colors.textSecondary }]}>**** **** **** 8970</Text>
              <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>Expires: 12/26</Text>
            </View>
        </View>

        <View style={[styles.methodCard, { borderColor: theme.colors.border }]}>
            <View style={[styles.methodIcon, { backgroundColor: '#EB001B' }]}>
               <Ionicons name="card" size={16} color="white" />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, { color: theme.colors.textSecondary }]}>**** **** **** 8970</Text>
              <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>Expires: 12/26</Text>
            </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.md,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  selectorText: {
    fontSize: 14,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  saveButton: {
    backgroundColor: '#FDE68A', // Pale yellow from screenshot
  },
  divider: {
    height: 40,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
    opacity: 0.6,
  },
  methodIcon: {
    width: 40,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: spacing.md,
  },
  methodLabel: {
    fontSize: 14,
  },
  methodSub: {
    fontSize: 10,
  },
});

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
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
  useUpdateUserPreferencesMutation 
} from '../../../api/user.api';

const LANGUAGES = [
  { id: 'en', name: 'English', sub: 'English', flag: '🇺🇸' },
  { id: 'hi', name: 'Hindi', sub: 'हिन्दी', flag: '🇮🇳' },
  { id: 'ar', name: 'Arabic', sub: 'العربية', flag: '🇸🇦' },
  { id: 'fr', name: 'French', sub: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'German', sub: 'Deutsch', flag: '🇩🇪' },
  { id: 'pt', name: 'Portuguese', sub: 'Português', flag: '🇵🇹' },
  { id: 'tr', name: 'Turkish', sub: 'Türkçe', flag: '🇹🇷' },
  { id: 'nl', name: 'Dutch', sub: 'Nederlands', flag: '🇳🇱' },
];

export const ChangeLanguageScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selected, setSelected] = useState('en');

  // RTK Query hooks
  const { data: profileResponse, isLoading } = useGetUserProfileQuery();
  const [updatePreferences, { isLoading: isSaving }] = useUpdateUserPreferencesMutation();

  const profile = profileResponse?.data;

  // Initialize selected language from backend profile preference
  useEffect(() => {
    if (profile?.preferences?.language) {
      setSelected(profile.preferences.language);
    }
  }, [profile]);

  // Save selection
  const handleSave = async () => {
    try {
      const response = await updatePreferences({
        language: selected,
      }).unwrap();

      if (response.success) {
        Alert.alert('Success', 'Language settings updated successfully!');
        navigation.goBack();
      }
    } catch (err: any) {
      console.error('[ChangeLanguageScreen] Save failed:', err);
      Alert.alert('Save Failed', err.message || 'Failed to update language.');
    }
  };

  const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.langItem, 
        { 
          borderColor: selected === item.id ? theme.colors.primary : theme.colors.border,
          backgroundColor: theme.colors.card 
        }
      ]}
      onPress={() => setSelected(item.id)}
      disabled={isSaving}
    >
      <View style={styles.langMain}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.langInfo}>
          <Text style={[styles.langName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.langSub, { color: theme.colors.textSecondary }]}>{item.sub}</Text>
        </View>
      </View>
      <View style={[
        styles.radio, 
        { borderColor: selected === item.id ? theme.colors.primary : theme.colors.border }
      ]}>
        {selected === item.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Change Language</Text>
        <View style={{ width: 60 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={LANGUAGES}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <AppButton 
          title="Save Language" 
          onPress={handleSave} 
          loading={isSaving}
          disabled={isLoading || isSaving}
        />
      </View>
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
  list: {
    padding: spacing.lg,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  langMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  langInfo: {
    gap: 2,
  },
  langName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  langSub: {
    fontSize: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const LANGUAGES = [
  { id: 'en', name: 'English', sub: 'English', flag: '🇺🇸' },
  { id: 'hi', name: 'Hindi', sub: 'Hindi', flag: '🇮🇳' },
  { id: 'ar', name: 'Arabic', sub: 'Arabic', flag: '🇸🇦' },
  { id: 'fr', name: 'French', sub: 'French', flag: '🇫🇷' },
  { id: 'de', name: 'German', sub: 'German', flag: '🇩🇪' },
  { id: 'pt', name: 'Portuguese', sub: 'Portuguese', flag: '🇵🇹' },
  { id: 'tr', name: 'Turkish', sub: 'Turkish', flag: '🇹🇷' },
  { id: 'nl', name: 'Dutch', sub: 'Nederlands', flag: '🇳🇱' },
];

export const ChangeLanguageScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selected, setSelected] = useState('en');

  const renderItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.langItem, 
        { borderColor: selected === item.id ? theme.colors.primary : theme.colors.border }
      ]}
      onPress={() => setSelected(item.id)}
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Change Language</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <AppButton title="Save" onPress={() => navigation.goBack()} />
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
});

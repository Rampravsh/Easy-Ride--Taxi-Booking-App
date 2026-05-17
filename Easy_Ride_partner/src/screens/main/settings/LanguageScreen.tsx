import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../theme';
import { PreferenceSelector, SelectorOption } from '../../../components/settings/PreferenceSelector';
import { ToggleSettingCard } from '../../../components/settings/ToggleSettingCard';

export const LanguageScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Language & Metric States
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedUnit, setSelectedUnit] = useState('metric');
  const [autoTranslate, setAutoTranslate] = useState(true);

  // Available Languages
  const languages: SelectorOption<string>[] = [
    { value: 'en', label: 'English (India & UK)', description: 'Standard platform translation', icon: 'flag-outline' },
    { value: 'hi', label: 'Hindi (हिन्दी)', description: 'हिंदी अनुवाद उपलब्ध है', icon: 'globe-outline' },
    { value: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)', description: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਸਹਾਇਤਾ', icon: 'globe-outline' },
    { value: 'ta', label: 'Tamil (தமிழ்)', description: 'தமிழ் மொழி ஆதரவு', icon: 'globe-outline' },
    { value: 'es', label: 'Spanish (Español)', description: 'Traducción estándar', icon: 'globe-outline' },
  ];

  // Measurement Units
  const unitOptions: SelectorOption<string>[] = [
    { value: 'metric', label: 'Metric System (km, m)', description: 'Default local standards', icon: 'speedometer-outline' },
    { value: 'imperial', label: 'Imperial System (mi, yd)', description: 'Recommended for UK/US standards', icon: 'trail-sign-outline' },
  ];

  const handleLanguageChange = async (val: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLanguage(val);
    const langObj = languages.find(l => l.value === val);
    Alert.alert(
      'Language Updated',
      `Platform language has been switched to ${langObj?.label}. Changes will apply across the app UI instantly.`
    );
  };

  const handleUnitChange = async (val: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedUnit(val);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* AppBar */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Language & Regional
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Language preference selector */}
        <PreferenceSelector
          title="App Language Dialect"
          options={languages}
          selectedValue={selectedLanguage}
          onSelect={handleLanguageChange}
        />

        {/* Distance metrics system */}
        <PreferenceSelector
          title="Measurement Metrics"
          options={unitOptions}
          selectedValue={selectedUnit}
          onSelect={handleUnitChange}
        />

        {/* Active chat translation helper */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Realtime Chat Optimization
        </Text>

        <ToggleSettingCard
          icon="chatbubbles-sharp"
          iconColor={theme.colors.primary}
          iconBgColor="rgba(245, 184, 0, 0.1)"
          title="Auto-Translate Passenger Chat"
          description="Automatically translate incoming passenger messages into your selected dialect"
          value={autoTranslate}
          onValueChange={(val) => setAutoTranslate(val)}
          statusText={autoTranslate ? 'AUTOMATIC TRANSLATION ACTIVE' : 'DIALECT PASS-THROUGH'}
        />

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
  },
  rightSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
});

export default LanguageScreen;

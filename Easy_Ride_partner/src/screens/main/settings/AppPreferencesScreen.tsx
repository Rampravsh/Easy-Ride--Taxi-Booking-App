import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../theme';
import { PreferenceSelector, SelectorOption } from '../../../components/settings/PreferenceSelector';
import { ToggleSettingCard } from '../../../components/settings/ToggleSettingCard';

export const AppPreferencesScreen: React.FC = () => {
  const { theme, setMode, mode } = useTheme();
  const navigation = useNavigation();

  // Settings State
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [keepAwake, setKeepAwake] = useState(true);

  // Map Options
  const mapOptions: SelectorOption<string>[] = [
    { value: 'in_app', label: 'Easy Ride In-App Map', description: 'Optimized vector maps with turn-by-turn guidance', icon: 'map-outline' },
    { value: 'google', label: 'Google Maps API External', description: 'Launches Google Maps on dispatch', icon: 'logo-google' },
    { value: 'waze', label: 'Waze Navigation', description: 'Launches Waze for real-time traffic updates', icon: 'navigate-circle-outline' },
  ];
  const [selectedMap, setSelectedMap] = useState('in_app');

  // Theme options
  const themeOptions: SelectorOption<'light' | 'dark' | 'system'>[] = [
    { value: 'light', label: 'Light Mode', description: 'Clean light theme', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark Mode', description: 'Saves battery, reduces night glare', icon: 'moon-outline' },
    { value: 'system', label: 'System Default', description: 'Syncs with device environment', icon: 'phone-portrait-outline' },
  ];

  // Voice Navigation Options
  const voiceOptions: SelectorOption<string>[] = [
    { value: 'full', label: 'Full Audio Guidance', description: 'All voice prompts, directions and street names', icon: 'volume-high-outline' },
    { value: 'alerts', label: 'Safety Alerts Only', description: 'Alerts for speed traps, tolls and traffic spikes', icon: 'volume-medium-outline' },
    { value: 'silent', label: 'Completely Muted', description: 'Visual mapping routes only', icon: 'volume-mute-outline' },
  ];
  const [voiceMode, setVoiceMode] = useState('full');

  // Telemetry Sync Options
  const syncOptions: SelectorOption<number>[] = [
    { value: 1, label: 'Realtime Tracker (1s)', description: 'Best dispatcher response, higher battery use', icon: 'airplane-outline' },
    { value: 5, label: 'Balanced Mode (5s)', description: 'Recommended for standard operational duty', icon: 'trending-up-outline' },
    { value: 10, label: 'Power Saver (10s)', description: 'Restricts updates, preserves battery lifespan', icon: 'battery-dead-outline' },
  ];
  const [syncRate, setSyncRate] = useState(5);

  const handleMapSelect = async (val: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMap(val);
  };

  const handleThemeSelect = async (val: 'light' | 'dark' | 'system') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode(val);
  };

  const handleVoiceSelect = async (val: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVoiceMode(val);
  };

  const handleSyncSelect = async (val: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSyncRate(val);
  };

  const handleHapticsToggle = async (val: boolean) => {
    if (val) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setHapticsEnabled(val);
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
          App & Map Settings
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Theme Settings Selector */}
        <PreferenceSelector
          title="App Theme Mode"
          options={themeOptions}
          selectedValue={mode}
          onSelect={handleThemeSelect}
        />

        {/* Map Engine Selector */}
        <PreferenceSelector
          title="Default Dispatch Navigation Engine"
          options={mapOptions}
          selectedValue={selectedMap}
          onSelect={handleMapSelect}
        />

        {/* Voice Navigation Selection */}
        <PreferenceSelector
          title="Voice Dispatch Guidance"
          options={voiceOptions}
          selectedValue={voiceMode}
          onSelect={handleVoiceSelect}
        />

        {/* Sync Rate telemetry Selection */}
        <PreferenceSelector
          title="GPS Telemetry Sync Frequency"
          options={syncOptions}
          selectedValue={syncRate}
          onSelect={handleSyncSelect}
        />

        {/* Physical settings cards */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Device Hardware Preferences
        </Text>

        <ToggleSettingCard
          icon="phone-portrait"
          iconColor="#4CAF50"
          iconBgColor="rgba(76, 175, 80, 0.1)"
          title="Tactile Haptic Triggers"
          description="Vibrate device on ride dispatch pings and button interactions"
          value={hapticsEnabled}
          onValueChange={handleHapticsToggle}
          statusText={hapticsEnabled ? 'DEVICE HAPTICS ENGAGED' : 'HAPTICS MUTED'}
        />

        <ToggleSettingCard
          icon="sunny"
          iconColor="#FF9500"
          iconBgColor="rgba(255, 149, 0, 0.1)"
          title="Wake Lock (Keep Screen On)"
          description="Prevent device lock screen from dimming while on active ride navigation"
          value={keepAwake}
          onValueChange={(val) => setKeepAwake(val)}
          statusText={keepAwake ? 'WAKELOCK ENGAGED' : 'STANDARD SCREEN TIME'}
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

export default AppPreferencesScreen;

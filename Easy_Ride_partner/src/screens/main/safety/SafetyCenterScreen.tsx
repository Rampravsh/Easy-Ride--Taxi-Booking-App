import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { SOSButton } from '../../../components/safety/SOSButton';
import { EmergencyContactCard, EmergencyContact } from '../../../components/safety/EmergencyContactCard';
import { SafetyOptionCard } from '../../../components/safety/SafetyOptionCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';

type SafetyCenterNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const SafetyCenterScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<SafetyCenterNavigationProp>();

  // Real-time audio recording trigger state
  const [isRecordingTripAudio, setIsRecordingTripAudio] = useState(false);
  const [sosActiveModal, setSosActiveModal] = useState(false);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: 'c1',
      name: 'Sarah Parker',
      phone: '+919876543210',
      relationship: 'Spouse',
      isVerified: true,
    },
    {
      id: 'c2',
      name: 'John Miller',
      phone: '+918765432109',
      relationship: 'Brother',
      isVerified: false,
    },
  ]);

  const handleTriggerSOS = () => {
    // Sound local alarm, alert backend dispatcher socket, open local dialer
    setSosActiveModal(true);
    // Simulate dispatcher API connection
    setTimeout(() => {
      Linking.openURL('tel:112');
    }, 1500);
  };

  const handleRemoveContact = (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this trusted emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setEmergencyContacts(prev => prev.filter(c => c.id !== id));
          } 
        }
      ]
    );
  };

  const handleAddContactPlaceholder = () => {
    Alert.alert('Add Contact', 'Integration placeholder to open phone address book or input contact detail form.');
  };

  const handleToggleAudioRecording = () => {
    setIsRecordingTripAudio(!isRecordingTripAudio);
    Alert.alert(
      isRecordingTripAudio ? 'Audio Recording Stopped' : 'Audio Recording Started',
      isRecordingTripAudio 
        ? 'Trip audio log has been encrypted and saved securely for verification review if needed.'
        : 'Easy Ride is now encrypting and recording live cabin audio. This log remains strictly encrypted on the system.'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Safety Center
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Status Pill */}
        <View style={[styles.securedPill, { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: theme.colors.success }]}>
          <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
          <Text style={[styles.securedText, { color: theme.colors.success, fontFamily: theme.typography.fontFamily.semiBold }]}>
            Trip Guard ADAS Active
          </Text>
        </View>

        {/* SOS Button Component */}
        <SOSButton onTriggerSOS={handleTriggerSOS} />

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Quick Safety Actions Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Safety Options
          </Text>
          
          <SafetyOptionCard
            icon="share-social"
            title="Share Active Ride Location"
            description="Broad-broadcast live GPS location details to spouses or dispatcher contacts."
            onPress={() => Alert.alert('Share Ride', 'Location sharing link generated and shared with trusted contacts.')}
            iconColor={theme.colors.primary}
            iconBgColor="rgba(245,184,0,0.1)"
          />

          <SafetyOptionCard
            icon={isRecordingTripAudio ? 'mic-off' : 'mic'}
            title={isRecordingTripAudio ? "Stop Audio Recording" : "Record Trip Audio"}
            description={isRecordingTripAudio ? "Currently encrypting cabin audio logs..." : "Encrypt and log ambient ride audio for safety checks."}
            onPress={handleToggleAudioRecording}
            iconColor={isRecordingTripAudio ? theme.colors.danger : theme.colors.text}
            iconBgColor={isRecordingTripAudio ? 'rgba(255,69,58,0.1)' : undefined}
          />

          <SafetyOptionCard
            icon="document-text"
            title="File Incident Report"
            description="Active dispute or accident logging directly to emergency responder teams."
            onPress={() => {
              navigation.navigate('IncidentReport');
            }}
            iconColor="#007AFF"
            iconBgColor="rgba(0,122,255,0.1)"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Emergency Contacts list */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
              Trusted Contacts
            </Text>
            <TouchableOpacity onPress={handleAddContactPlaceholder} activeOpacity={0.7}>
              <Text style={[styles.addText, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                + Add New
              </Text>
            </TouchableOpacity>
          </View>
          
          {emergencyContacts.map((contact) => (
            <EmergencyContactCard 
              key={contact.id} 
              contact={contact} 
              onRemove={handleRemoveContact}
            />
          ))}
        </View>
      </ScrollView>

      {/* SOS Active Modal Overlay */}
      <Modal visible={sosActiveModal} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(229,57,53,0.98)' }]}>
          <Ionicons name="warning" size={80} color={theme.colors.white} style={styles.modalIcon} />
          <Text style={[styles.modalTitle, { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.white }]}>
            EMERGENCY SOS ACTIVE
          </Text>
          <Text style={[styles.modalBody, { fontFamily: theme.typography.fontFamily.medium, color: 'rgba(255, 255, 255, 0.8)' }]}>
            We are sending your live location parameters and vehicle info to dispatch centers. Calling local emergency helpline...
          </Text>
          <TouchableOpacity 
            onPress={() => setSosActiveModal(false)}
            style={[styles.cancelBtn, { backgroundColor: theme.colors.white }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.cancelText, { color: theme.colors.danger, fontFamily: theme.typography.fontFamily.bold }]}>
              CANCEL EMERGENCY ALARM
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 20,
  },
  headerRight: {
    width: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  securedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 16,
  },
  securedText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  addText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalIcon: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  cancelText: {
    fontSize: 15,
  },
});
export default SafetyCenterScreen;

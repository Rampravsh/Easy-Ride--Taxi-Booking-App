import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { IncidentTimeline, TimelineStep } from '../../../components/safety/IncidentTimeline';

const INCIDENT_CATEGORIES = [
  { key: 'accident', label: 'Vehicle Accident', icon: 'car-sport' },
  { key: 'conduct', label: 'Passenger Misbehavior', icon: 'people' },
  { key: 'route', label: 'Route/Navigation Conflict', icon: 'navigate' },
  { key: 'payment', label: 'Dispute Over Cash Payment', icon: 'cash' },
];

export const IncidentReportScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('accident');
  const [rideIdInput, setRideIdInput] = useState('ER-9828');
  const [description, setDescription] = useState('');
  const [isMediaAttached, setIsMediaAttached] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Simulated escalation progress steps
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([
    {
      title: 'Incident Logged',
      description: 'Your safety report has been successfully recorded in our system.',
      time: 'Just now',
      status: 'completed',
    },
    {
      title: 'Assigned to Dispatch Response',
      description: 'A designated dispatch security supervisor has been assigned to look into details.',
      time: 'Pending Allocation',
      status: 'active',
    },
    {
      title: 'Passenger Account Review',
      description: 'A complete policy check is initialized on passenger account parameters.',
      status: 'pending',
    },
    {
      title: 'Escalation Resolution',
      description: 'The support agent will finalize payouts adjustments or contact police departments if needed.',
      status: 'pending',
    },
  ]);

  const handleAttachMedia = () => {
    setIsMediaAttached(true);
    Alert.alert('File Attached', 'Camera snapshot placeholder. Image successfully compressed and attached.');
  };

  const handleSubmitReport = () => {
    if (description.trim() === '') {
      Alert.alert('Error', 'Please describe the incident to proceed.');
      return;
    }
    setReportSubmitted(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          {reportSubmitted ? 'Verification Timeline' : 'Report Incident'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {reportSubmitted ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.submittedContainer}>
            <View style={[styles.statusIconCircle, { backgroundColor: 'rgba(76,175,80,0.1)' }]}>
              <Ionicons name="shield-checkmark" size={48} color={theme.colors.success} />
            </View>
            <Text style={[styles.submittedTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
              Incident Escalation Active
            </Text>
            <Text style={[styles.submittedBody, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
              Your safety report (Ticket #{Math.floor(100000 + Math.random() * 900000)}) has been forwarded to the 24/7 Kinetic Support Center.
            </Text>
          </View>

          <View style={[styles.timelineSection, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
              Resolution Progress
            </Text>
            <IncidentTimeline steps={timelineSteps} />
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={[styles.closeBtnText, { color: theme.colors.black, fontFamily: theme.typography.fontFamily.bold }]}>
              RETURN TO SAFETY CENTER
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Active Category choice */}
          <View style={styles.section}>
            <Text style={[styles.inputLabel, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Select Incident Category
            </Text>
            <View style={styles.gridRow}>
              {INCIDENT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => setSelectedCategory(cat.key)}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={20}
                      color={isSelected ? theme.colors.black : theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        {
                          color: isSelected ? theme.colors.black : theme.colors.text,
                          fontFamily: theme.typography.fontFamily.medium,
                        },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Ride selection input */}
          <View style={styles.section}>
            <Text style={[styles.inputLabel, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Associated Ride ID
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
              value={rideIdInput}
              onChangeText={setRideIdInput}
              placeholder="e.g. ER-9828"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Issue Description */}
          <View style={styles.section}>
            <Text style={[styles.inputLabel, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Describe What Happened
            </Text>
            <TextInput
              style={[
                styles.descInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Please provide clear details regarding the accident or dispute so our dispatch supervisor can understand the situation fully."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Attach evidence */}
          <View style={styles.section}>
            <Text style={[styles.inputLabel, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Attach Photo Evidence (Optional)
            </Text>
            <TouchableOpacity
              onPress={handleAttachMedia}
              style={[
                styles.mediaBtn,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              {isMediaAttached ? (
                <View style={styles.mediaAttachedContent}>
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                  <Text style={[styles.mediaBtnText, { color: theme.colors.success, fontFamily: theme.typography.fontFamily.semiBold }]}>
                    Photo Evidence Attached
                  </Text>
                </View>
              ) : (
                <View style={styles.mediaAttachedContent}>
                  <Ionicons name="camera" size={24} color={theme.colors.primary} />
                  <Text style={[styles.mediaBtnText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
                    Take Photo / Upload Files
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.colors.danger }]}
            onPress={handleSubmitReport}
            activeOpacity={0.8}
          >
            <Text style={[styles.submitBtnText, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold }]}>
              SUBMIT EMERGENCY ESCALATION
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 15,
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    alignItems: 'flex-start',
  },
  categoryLabel: {
    fontSize: 12,
  },
  textInput: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  descInput: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  mediaBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaAttachedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mediaBtnText: {
    fontSize: 14,
  },
  submitBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 15,
  },
  submittedContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  statusIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittedTitle: {
    fontSize: 22,
  },
  submittedBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  timelineSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  closeBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  closeBtnText: {
    fontSize: 14,
  },
});
export default IncidentReportScreen;

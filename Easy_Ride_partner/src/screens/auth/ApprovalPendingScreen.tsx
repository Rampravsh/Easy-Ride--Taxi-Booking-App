import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AppButton } from '../../components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';

export const ApprovalPendingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ApprovalPending'>>();

  const handleSupport = () => {
    // Simulate support trigger
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View style={[styles.successCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="time" size={64} color="#4CAF50" />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Application Submitted</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your profile details and vehicle documents are currently under operational review.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Verification Timeline</Text>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: '#4CAF50' }]} />
              <View style={[styles.timelineLine, { backgroundColor: '#4CAF50' }]} />
            </View>
            <View style={styles.timelineRight}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Step 1: Submit Application</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>Completed successfully.</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.timelineLine, { backgroundColor: theme.colors.border }]} />
            </View>
            <View style={styles.timelineRight}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Step 2: Operational Review</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>In progress. Usually takes 24-48 business hours.</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: theme.colors.border }]} />
            </View>
            <View style={styles.timelineRight}>
              <Text style={[styles.stepTitle, { color: theme.colors.textSecondary }]}>Step 3: Go Online</Text>
              <Text style={[styles.stepDesc, { color: theme.colors.textSecondary }]}>Account activation & start earning.</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Check Status / Refresh"
            variant="primary"
            onPress={() => {
              // Simulate check approval
              navigation.navigate('AccountApproved');
            }}
            style={styles.button}
          />
          <View style={styles.footerSpacing} />
          <TouchableOpacity 
            style={[styles.supportBtn, { borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('RejectedVerification', { reasons: ['Driving License is blurred or unreadable', 'Vehicle insurance document is expired'] })}
          >
            <Ionicons name="chatbubbles-outline" size={20} color={theme.colors.text} style={{ marginRight: 8 }} />
            <Text style={[styles.supportBtnText, { color: theme.colors.text }]}>Contact Partner Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  footerSpacing: {
    height: 12,
  },
  supportBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  supportBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

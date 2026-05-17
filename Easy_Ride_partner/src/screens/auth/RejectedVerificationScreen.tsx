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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AppButton } from '../../components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';

export const RejectedVerificationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'RejectedVerification'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'RejectedVerification'>>();

  const reasons = route.params?.reasons || [
    'Uploaded Driving License image is blurred or unreadable.',
    'Vehicle registration details do not match official records.'
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View style={[styles.errorCircle, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="alert-circle" size={64} color="#F44336" />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Verification Rejected</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            We found some issues during the operational audit of your documents. Please review and fix them below.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.danger }]}>Issues Identified</Text>
          
          {reasons.map((reason, index) => (
            <View key={index} style={styles.issueItem}>
              <Ionicons name="close-circle" size={20} color="#F44336" style={styles.issueIcon} />
              <Text style={[styles.issueText, { color: theme.colors.text }]}>{reason}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Re-upload Documents"
            variant="primary"
            onPress={() => navigation.navigate('DocumentUpload')}
            style={styles.button}
          />
          <View style={styles.footerSpacing} />
          <TouchableOpacity 
            style={[styles.supportBtn, { borderColor: theme.colors.border }]}
            onPress={() => {}}
          >
            <Ionicons name="chatbubbles-outline" size={20} color={theme.colors.text} style={{ marginRight: 8 }} />
            <Text style={[styles.supportBtnText, { color: theme.colors.text }]}>Talk to Support Agent</Text>
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
  errorCircle: {
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
    marginBottom: 16,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  issueIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
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

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AppButton } from '../../components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';

export const AccountApprovedScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'AccountApproved'>>();
  const dispatch = useDispatch();

  const handleGoOnline = () => {
    // Authenticate the user state in Redux to swap Auth to Main stack
    dispatch(setCredentials({ 
      token: 'mock-session-token', 
      user: { name: 'John Doe', email: 'johndoe@example.com', role: 'partner' } 
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View style={[styles.successCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Congratulations!</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your driver partner application has been approved. You are now authorized to pick up riders and start earning!
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Driver Quick Checklist</Text>
          
          <View style={styles.checkItem}>
            <Ionicons name="checkbox" size={22} color={theme.colors.primary} style={styles.checkIcon} />
            <Text style={[styles.checkText, { color: theme.colors.textSecondary }]}>Ensure GPS and location services are active</Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkbox" size={22} color={theme.colors.primary} style={styles.checkIcon} />
            <Text style={[styles.checkText, { color: theme.colors.textSecondary }]}>Carry physical driving license & vehicle RC</Text>
          </View>

          <View style={styles.checkItem}>
            <Ionicons name="checkbox" size={22} color={theme.colors.primary} style={styles.checkIcon} />
            <Text style={[styles.checkText, { color: theme.colors.textSecondary }]}>Equip vehicle safety standards & phone holder</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Go Online & Start Driving"
            variant="primary"
            onPress={handleGoOnline}
            style={styles.button}
          />
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
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 36,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 12,
  },
  checkText: {
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
});

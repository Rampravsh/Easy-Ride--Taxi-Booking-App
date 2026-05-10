import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'payment' | 'discount' | 'card' | 'wallet';
}

interface NotificationSection {
  title: string;
  data: NotificationItem[];
}

const NOTIFICATIONS: NotificationSection[] = [
  {
    title: 'Today',
    data: [
      { id: '1', title: 'Payment Successfully!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'payment' },
      { id: '2', title: '30% Special Discount!!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'discount' },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      { id: '3', title: 'Payment Successfully!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'payment' },
      { id: '4', title: 'Credit Card added!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'card' },
      { id: '5', title: 'Added Money wallet Successfully!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'wallet' },
      { id: '6', title: '5% Special Discount!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'discount' },
    ],
  },
  {
    title: 'May, 27 2023',
    data: [
      { id: '7', title: 'Payment Successfully!', description: 'Lorem ipsum dolor sit amet consectetur. Id mi ac tincidunt eleifend vitae', type: 'payment' },
    ],
  },
];

export const NotificationScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return 'checkmark-circle';
      case 'discount': return 'pricetag';
      case 'card': return 'card';
      case 'wallet': return 'wallet';
      default: return 'notifications';
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.colors.background : '#F5F5F5' }]}>
        <Ionicons name={getIcon(item.type) as any} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Notification" onBack={() => navigation.goBack()} />
      <SectionList
        sections={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.scrollContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
});

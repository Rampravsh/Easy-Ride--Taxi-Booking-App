import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { SupportTicketCard, SupportTicket } from '../../../components/support/SupportTicketCard';
import { HelpCategoryCard } from '../../../components/support/HelpCategoryCard';
import { SupportChatCard, SupportChatMessage } from '../../../components/support/SupportChatCard';

const HELP_CATEGORIES = [
  { key: 'fare', title: 'Fare & Payout Disputes', icon: 'cash' },
  { key: 'app', title: 'App Bugs & GPS Lag', icon: 'bug' },
  { key: 'conduct', title: 'Passenger Conduct Rules', icon: 'people' },
  { key: 'account', title: 'Account Suspension & Tiers', icon: 'shield-checkmark' },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'T-8291',
    category: 'Fare Dispute',
    subject: 'Incorrect toll charges applied during Terminal 2 pickup',
    date: 'May 15, 2026',
    status: 'pending',
    lastUpdate: 'Agent reviewing toll receipt',
  },
  {
    id: 'T-7652',
    category: 'App Bug',
    subject: 'GPS coordinates drifted off route, fare reduced',
    date: 'May 10, 2026',
    status: 'resolved',
    lastUpdate: '₹85 manual credit applied',
  },
];

export const SupportScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [newMsgText, setNewMsgText] = useState('');

  // Simulated messaging logs for dispute #T-8291
  const [chatMessages, setChatMessages] = useState<SupportChatMessage[]>([
    {
      id: 'm1',
      sender: 'rider',
      text: "Hi support, during my ride to Terminal 2 (ID ER-9812), the toll gate automatically scanned, but the system didn't calculate the ₹100 toll in my weekly payout summary.",
      timestamp: 'May 15, 11:30 AM',
    },
    {
      id: 'm2',
      sender: 'agent',
      text: "Hello Ram, thank you for writing in. I am reviewing the toll gate scanned receipt against your GPS parameters. This process normally takes around 2 hours.",
      timestamp: 'May 15, 11:45 AM',
      agentName: 'Jessica Cole',
    },
  ]);

  const handlePressCategory = (title: string) => {
    Alert.alert('Support Portal', `Redirecting to the dynamic sub-articles for: ${title}`);
  };

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setChatModalVisible(true);
  };

  const handleSendSupportMessage = () => {
    if (newMsgText.trim() === '') return;

    const newMsg: SupportChatMessage = {
      id: Math.random().toString(),
      sender: 'rider',
      text: newMsgText.trim(),
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMsgText('');

    // Simulate Agent Reply
    setTimeout(() => {
      const agentReply: SupportChatMessage = {
        id: Math.random().toString(),
        sender: 'agent',
        text: "Thank you for the update. We have logged these details and will coordinate with the billing operations department. Payout updates will reflect directly in your wallet logs.",
        timestamp: 'Just now',
        agentName: 'Jessica Cole',
      };
      setChatMessages((prev) => [...prev, agentReply]);
    }, 2500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Support Hub
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Help categories grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            How can we help you?
          </Text>
          <View style={styles.gridRow}>
            {HELP_CATEGORIES.map((cat) => (
              <View key={cat.key} style={styles.gridItem}>
                <HelpCategoryCard
                  icon={cat.icon}
                  title={cat.title}
                  onPress={() => handlePressCategory(cat.title)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Active Support Tickets */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Active Support Tickets
          </Text>
          
          {tickets.map((t) => (
            <SupportTicketCard
              key={t.id}
              ticket={t}
              onPress={handleSelectTicket}
            />
          ))}
        </View>
      </ScrollView>

      {/* Ticket Details / Chat Modal */}
      <Modal visible={chatModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.modalHeaderLeft}>
              <TouchableOpacity onPress={() => setChatModalVisible(false)} style={styles.backBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <View>
                <Text style={[styles.modalTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
                  Ticket #{selectedTicket?.id}
                </Text>
                <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  {selectedTicket?.category}
                </Text>
              </View>
            </View>
          </View>

          {/* Messages list */}
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SupportChatCard message={item} />}
            contentContainerStyle={styles.modalChatList}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing Area */}
          <View style={[styles.modalInputBar, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
              value={newMsgText}
              onChangeText={setNewMsgText}
              placeholder="Send message to support..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
            <TouchableOpacity
              onPress={handleSendSupportMessage}
              disabled={newMsgText.trim() === ''}
              style={[
                styles.modalSendBtn,
                {
                  backgroundColor: newMsgText.trim() === '' ? theme.colors.border : theme.colors.primary,
                },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={newMsgText.trim() === '' ? theme.colors.textSecondary : theme.colors.black} 
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalSubtitle: {
    fontSize: 12,
  },
  modalChatList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  modalInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
  },
  modalSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SupportScreen;

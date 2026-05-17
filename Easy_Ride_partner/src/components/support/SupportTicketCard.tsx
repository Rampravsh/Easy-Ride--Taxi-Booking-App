import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { IssueStatusBadge, TicketStatus } from './IssueStatusBadge';

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  date: string;
  status: TicketStatus;
  lastUpdate: string;
}

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onPress: (ticket: SupportTicket) => void;
}

export const SupportTicketCard: React.FC<SupportTicketCardProps> = ({
  ticket,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(ticket)}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.ticketIdRow}>
          <Text style={[styles.ticketId, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
            #{ticket.id}
          </Text>
          <Text style={[styles.dot, { color: theme.colors.textSecondary }]}>•</Text>
          <Text style={[styles.category, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
            {ticket.category}
          </Text>
        </View>
        <IssueStatusBadge status={ticket.status} />
      </View>

      <Text 
        style={[styles.subject, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
        numberOfLines={1}
      >
        {ticket.subject}
      </Text>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Created: {ticket.date}
        </Text>
        <View style={styles.updateRow}>
          <Text style={[styles.footerText, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
            {ticket.lastUpdate}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketId: {
    fontSize: 12,
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  category: {
    fontSize: 14,
  },
  subject: {
    fontSize: 15,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

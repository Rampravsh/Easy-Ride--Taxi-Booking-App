import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'rider' | 'customer';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  isMedia?: boolean;
  mediaType?: 'location' | 'image';
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const { theme } = useTheme();
  const isRider = message.sender === 'rider';

  const getStatusIcon = () => {
    if (!isRider || !message.status) return null;
    switch (message.status) {
      case 'sent':
        return <Ionicons name="checkmark" size={14} color={theme.colors.textSecondary} />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={14} color={theme.colors.textSecondary} />;
      case 'read':
        return <Ionicons name="checkmark-done" size={14} color={theme.colors.primary} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, isRider ? styles.riderContainer : styles.customerContainer]}>
      <View
        style={[
          styles.bubble,
          isRider
            ? { backgroundColor: theme.colors.primary, borderBottomRightRadius: 2 }
            : { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 2 },
        ]}
      >
        {message.isMedia && message.mediaType === 'location' && (
          <View style={styles.mediaContainer}>
            <Ionicons name="location" size={20} color={isRider ? theme.colors.black : theme.colors.primary} />
            <Text style={[styles.mediaText, { color: isRider ? theme.colors.black : theme.colors.text }]}>
              Shared Location
            </Text>
          </View>
        )}
        <Text
          style={[
            styles.text,
            {
              color: isRider ? theme.colors.black : theme.colors.text,
              fontFamily: theme.typography.fontFamily.regular,
            },
          ]}
        >
          {message.text}
        </Text>
        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              {
                color: isRider ? 'rgba(0,0,0,0.6)' : theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.regular,
              },
            ]}
          >
            {message.timestamp}
          </Text>
          {getStatusIcon()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: 'row',
    width: '100%',
  },
  riderContainer: {
    justifyContent: 'flex-end',
    paddingLeft: 48,
  },
  customerContainer: {
    justifyContent: 'flex-start',
    paddingRight: 48,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  mediaText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

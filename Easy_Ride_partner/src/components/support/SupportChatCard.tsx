import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export interface SupportChatMessage {
  id: string;
  sender: 'agent' | 'rider';
  text: string;
  timestamp: string;
  agentName?: string;
}

interface SupportChatCardProps {
  message: SupportChatMessage;
}

export const SupportChatCard: React.FC<SupportChatCardProps> = ({ message }) => {
  const { theme } = useTheme();
  const isRider = message.sender === 'rider';

  return (
    <View style={[styles.wrapper, isRider ? styles.riderWrapper : styles.agentWrapper]}>
      {!isRider && message.agentName && (
        <Text style={[styles.agentName, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.semiBold }]}>
          {message.agentName} (Support Agent)
        </Text>
      )}

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isRider ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: isRider ? 0 : 1,
            borderBottomRightRadius: isRider ? 2 : 16,
            borderBottomLeftRadius: isRider ? 16 : 2,
          },
        ]}
      >
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    width: '100%',
  },
  riderWrapper: {
    alignItems: 'flex-end',
    paddingLeft: 50,
  },
  agentWrapper: {
    alignItems: 'flex-start',
    paddingRight: 50,
  },
  agentName: {
    fontSize: 11,
    marginBottom: 4,
    marginLeft: 6,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 19,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});

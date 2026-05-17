import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface ChatInputBarProps {
  onSend: (text: string) => void;
  onSendLocation?: () => void;
  loading?: boolean;
}

const QUICK_TEMPLATES = [
  "I have arrived at the pickup.",
  "I'm in traffic, will be there soon.",
  "Where are you standing?",
  "I'm waiting at the designated spot.",
  "OK"
];

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend, onSendLocation, loading = false }) => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;
    onSend(inputText.trim());
    setInputText('');
  };

  const handleSelectTemplate = (template: string) => {
    onSend(template);
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
      {/* Quick Template Replies for Driver Convenience */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.templatesContainer}
      >
        {QUICK_TEMPLATES.map((tmpl, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.templateChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => handleSelectTemplate(tmpl)}
          >
            <Text style={[styles.templateText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
              {tmpl}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputContainer}>
        {onSendLocation && (
          <TouchableOpacity 
            onPress={onSendLocation} 
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.7}
          >
            <Ionicons name="location" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme.colors.surface, 
              color: theme.colors.text,
              borderColor: theme.colors.border,
              fontFamily: theme.typography.fontFamily.regular
            }
          ]}
          placeholder="Send a message..."
          placeholderTextColor={theme.colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity 
          onPress={handleSend} 
          disabled={loading || inputText.trim() === ''}
          style={[
            styles.sendBtn, 
            { 
              backgroundColor: inputText.trim() === '' ? theme.colors.border : theme.colors.primary 
            }
          ]}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="send" 
            size={18} 
            color={inputText.trim() === '' ? theme.colors.textSecondary : theme.colors.black} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  templatesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
  },
  templateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  templateText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
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
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

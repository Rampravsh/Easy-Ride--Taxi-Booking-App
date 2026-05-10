import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

import { Message } from '../../../types';

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Good evening!', sender: 'other', time: '6:30pm' },
  { id: '2', text: 'Welcome to CarGo Customer Service', sender: 'other', time: '6:30pm' },
  { id: '3', text: 'Welcome to CarGo Customer Service', sender: 'me', time: '6:30pm' },
  { id: '4', text: 'Welcome to CarGo Customer Service', sender: 'other', time: '8:35pm' },
  { id: '5', text: 'Welcome to CarGo Customer service', sender: 'me', time: 'Just now' },
];

export const ChatScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [message, setMessage] = useState('');

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      {item.sender === 'other' && (
        <Image 
          source={require('../../../../assets/images/user_avatar.png')}
          style={styles.avatar}
        />
      )}
      <View style={styles.messageContent}>
        <View style={[
          styles.bubble,
          item.sender === 'me' 
            ? [styles.myBubble, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary, borderWidth: 1 }]
            : [styles.otherBubble, { backgroundColor: '#E5E7EB' }]
        ]}>
          <Text style={[styles.messageText, { color: theme.colors.text }]}>{item.text}</Text>
        </View>
        <Text style={[
          styles.timeText, 
          { color: theme.colors.textSecondary },
          item.sender === 'me' ? { textAlign: 'right' } : { textAlign: 'left', marginLeft: item.sender === 'other' ? 0 : 0 }
        ]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Chat</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={INITIAL_MESSAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.inputContainer, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={30} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Type your message"
              placeholderTextColor={theme.colors.textSecondary}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity>
              <Ionicons name="happy-outline" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.sendButton]}>
             <Ionicons name="paper-plane-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    maxWidth: '85%',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  messageContent: {
    flex: 1,
  },
  bubble: {
    padding: spacing.md,
    borderRadius: 15,
  },
  otherBubble: {
    borderTopLeftRadius: 0,
  },
  myBubble: {
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
  },
  attachButton: {
    marginRight: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: spacing.sm,
  },
});

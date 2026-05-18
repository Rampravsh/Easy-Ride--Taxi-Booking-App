import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector } from '../../../redux/hooks';
import { useGetMessagesQuery, useSendMessageMutation } from '../../../api/chat.api';
import { Message } from '../../../types/chat';
import { SwaggerRider, SwaggerVehicle } from '../../../types';
import realtimeChatService from '../../../services/realtimeChat.service';

export const ChatScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // 1. Retrieve current ride & user details from Redux
  const activeRide = useAppSelector((state) => state.ride.activeRide);
  const currentUserId = useAppSelector((state) => state.auth.backendUser?._id) || '';
  const rideId = activeRide?._id || 'global_support'; // Fallback to a default support ID if no active ride

  // Safely extract populated profile records
  const driverProfile = activeRide?.rider && typeof activeRide.rider !== 'string'
    ? (activeRide.rider as SwaggerRider)
    : null;
  const driverName = driverProfile?.fullName || 'Driver Support';
  
  const vehicleProfile = activeRide?.vehicle && typeof activeRide.vehicle !== 'string'
    ? (activeRide.vehicle as SwaggerVehicle)
    : null;

  // 2. Fetch Chat History via RTK Query
  const { isLoading, refetch } = useGetMessagesQuery(
    { rideId, limit: 50 },
    { skip: !rideId }
  );

  // 3. Listen to realtime message state updates in Redux
  const activeChatMessages = useAppSelector((state) => state.chat.activeChats[rideId] || []);
  const typingIndicators = useAppSelector((state) => state.chat.typingIndicators[rideId] || {});
  
  // Determine if receiver (driver) is currently typing
  const isDriverTyping = Object.entries(typingIndicators).some(
    ([uid, typing]) => uid !== currentUserId && typing
  );

  // 4. Send Message Mutation hook
  const [sendMessageMutation, { isLoading: isSending }] = useSendMessageMutation();

  // 5. Manage Chat Entrance and Departure Lifecycle
  useEffect(() => {
    if (rideId) {
      realtimeChatService.enterChat(rideId);
      refetch(); // Invalidate & pull fresh logs
    }
    return () => {
      if (rideId) {
        realtimeChatService.leaveChat(rideId);
      }
    };
  }, [rideId]);

  // 6. Auto Scroll to Bottom on message lists mutation
  useEffect(() => {
    if (activeChatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [activeChatMessages, isDriverTyping]);

  // 7. Send Message Callback
  const handleSendMessage = async () => {
    if (!message.trim() || !rideId) return;

    const contentToSend = message.trim();
    setMessage(''); // Clear input optimistically

    try {
      await sendMessageMutation({
        rideId,
        content: contentToSend,
        messageType: 'text',
      }).unwrap();
    } catch (err) {
      console.error('[ChatScreen] Error sending message:', err);
    }
  };

  // 8. Typing Handler
  const handleTextChange = (text: string) => {
    setMessage(text);
    if (rideId) {
      realtimeChatService.handleKeyPress(rideId);
    }
  };

  // 9. Format Chat Messages into UI compatible structures
  const formattedMessages: Message[] = [...activeChatMessages]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((msg) => ({
      id: msg._id,
      text: msg.content,
      sender: msg.sender === currentUserId ? 'me' : 'other',
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: msg.messageType,
      status: msg.status,
    }));

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      {item.sender === 'other' && (
        <Image 
          source={
            driverProfile?.profileImage
              ? { uri: driverProfile.profileImage } 
              : require('../../../../assets/images/user_avatar.png')
          }
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
        <View style={styles.metaRow}>
          <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
            {item.time}
          </Text>
          {item.sender === 'me' && (
            <Ionicons 
              name={item.status === 'read' ? 'checkmark-done' : 'checkmark'} 
              size={14} 
              color={item.status === 'read' ? '#10B981' : theme.colors.textSecondary} 
              style={styles.statusIcon}
            />
          )}
        </View>
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
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {driverName}
          </Text>
          {vehicleProfile && (
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {`${vehicleProfile.brand} ${vehicleProfile.modelName} - ${vehicleProfile.numberPlate}`}
            </Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Calling')} 
          disabled={!driverProfile}
          style={[styles.callIconContainer, !driverProfile && { opacity: 0.3 }]}
        >
          <Ionicons name="call" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main chat history list */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={formattedMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Typing Indicator Bar */}
      {isDriverTyping && (
        <View style={styles.typingContainer}>
          <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
            {driverName} is typing...
          </Text>
        </View>
      )}

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
              onChangeText={handleTextChange}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity>
              <Ionicons name="happy-outline" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            onPress={handleSendMessage}
            disabled={!message.trim()} 
            style={[styles.sendButton, !message.trim() && { opacity: 0.4 }]}
          >
             <Ionicons name="paper-plane" size={24} color={theme.colors.primary} />
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
    width: 60,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
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

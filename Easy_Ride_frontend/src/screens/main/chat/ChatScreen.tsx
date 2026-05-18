import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector } from '../../../redux/hooks';
import { useGetMessagesQuery, useSendMessageMutation } from '../../../api/chat.api';
import { Message } from '../../../types/chat';
import { SwaggerRider, SwaggerVehicle } from '../../../types';
import realtimeChatService from '../../../services/realtimeChat.service';

const { width } = Dimensions.get('window');

const FAST_TEMPLATES = [
  "I am at the designated pickup.",
  "Heading out right now!",
  "Please wait 2 minutes.",
  "Understood, thank you!"
];

export const ChatScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Retrieve current ride & user details from Redux
  const activeRide = useAppSelector((state) => state.ride.activeRide);
  const currentUserId = useAppSelector((state) => state.auth.backendUser?._id) || '';
  const rideId = activeRide?._id || 'global_support';

  const driverProfile = activeRide?.rider && typeof activeRide.rider !== 'string'
    ? (activeRide.rider as SwaggerRider)
    : null;
  const driverName = driverProfile?.fullName || 'EasyRide Partner';
  
  const vehicleProfile = activeRide?.vehicle && typeof activeRide.vehicle !== 'string'
    ? (activeRide.vehicle as SwaggerVehicle)
    : null;

  // Fetch Chat History via RTK Query
  const { isLoading, refetch } = useGetMessagesQuery(
    { rideId, limit: 50 },
    { skip: !rideId }
  );

  // Listen to realtime messages in Redux
  const activeChatMessages = useAppSelector((state) => state.chat.activeChats[rideId] || []);
  const typingIndicators = useAppSelector((state) => state.chat.typingIndicators[rideId] || {});
  
  const isDriverTyping = Object.entries(typingIndicators).some(
    ([uid, typing]) => uid !== currentUserId && typing
  );

  // Send Message Mutation hook
  const [sendMessageMutation] = useSendMessageMutation();

  // Chat entrance and departure lifecycle
  useEffect(() => {
    if (rideId) {
      realtimeChatService.enterChat(rideId);
      refetch();
    }
    return () => {
      if (rideId) {
        realtimeChatService.leaveChat(rideId);
      }
    };
  }, [rideId]);

  // Auto Scroll to Bottom
  useEffect(() => {
    if (activeChatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [activeChatMessages, isDriverTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !rideId) return;

    try {
      await sendMessageMutation({
        rideId,
        content: textToSend.trim(),
        messageType: 'text',
      }).unwrap();
    } catch (err) {
      console.error('[ChatScreen] Send failure:', err);
    }
  };

  const submitTextInput = () => {
    if (!message.trim()) return;
    const txt = message;
    setMessage('');
    handleSendMessage(txt);
  };

  const handleTextChange = (text: string) => {
    setMessage(text);
    if (rideId) {
      realtimeChatService.handleKeyPress(rideId);
    }
  };

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

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[
        styles.messageWrapper,
        isMe ? styles.myMessageWrapper : styles.otherMessageWrapper
      ]}>
        {!isMe && (
          <Image 
            source={
              driverProfile?.profileImage
                ? { uri: driverProfile.profileImage } 
                : require('../../../../assets/images/user_avatar.png')
            }
            style={styles.avatar}
          />
        )}
        <View style={isMe ? styles.myContentWrapper : styles.otherContentWrapper}>
          <View style={[
            styles.bubble,
            isMe 
              ? [styles.myBubble, { backgroundColor: theme.colors.primary }]
              : [styles.otherBubble, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '33', borderWidth: 1 }]
          ]}>
            <Text style={[styles.messageText, { color: isMe ? '#000000' : theme.colors.text }]}>
              {item.text}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
              {item.time}
            </Text>
            {isMe && (
              <Ionicons 
                name={item.status === 'read' ? 'checkmark-done' : 'checkmark'} 
                size={14} 
                color={item.status === 'read' ? theme.colors.primary : theme.colors.textSecondary} 
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Immersive Chat Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border + '15' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{driverName}</Text>
          {vehicleProfile && (
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {vehicleProfile.brand} {vehicleProfile.modelName} • {vehicleProfile.numberPlate}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Calling')} 
          disabled={!driverProfile}
          style={[styles.callBtn, { backgroundColor: 'rgba(255, 215, 0, 0.12)' }]}
        >
          <Ionicons name="call" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messaging thread panel */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Syncing active channel logs...</Text>
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

      {/* Typing Feed */}
      {isDriverTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
            <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
          </View>
          <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>{driverName} is drafting a response...</Text>
        </View>
      )}

      {/* Templates Row */}
      <View style={styles.fastTemplatesRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templatesScroll}>
          {FAST_TEMPLATES.map((tmpl, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.templatePill, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '33' }]}
              onPress={() => handleSendMessage(tmpl)}
            >
              <Text style={[styles.templateText, { color: theme.colors.text }]}>{tmpl}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
      >
        <View style={[styles.inputPanel, { borderTopColor: theme.colors.border + '15', backgroundColor: theme.colors.background }]}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '22' }]}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Draft your message here..."
              placeholderTextColor={theme.colors.textSecondary}
              value={message}
              onChangeText={handleTextChange}
              onSubmitEditing={submitTextInput}
            />
            <TouchableOpacity style={styles.emojiBtn}>
              <Ionicons name="happy-outline" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={submitTextInput}
            disabled={!message.trim()} 
            style={[styles.sendBtn, { backgroundColor: message.trim() ? theme.colors.primary : 'rgba(0,0,0,0.03)' }]}
          >
             <Ionicons name="arrow-up" size={22} color={message.trim() ? '#000000' : theme.colors.textSecondary} />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    maxWidth: '82%',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  otherContentWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  myContentWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 18,
  },
  otherBubble: {
    borderTopLeftRadius: 4,
  },
  myBubble: {
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#9CA3AF',
  },
  typingText: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  fastTemplatesRow: {
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  templatesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  templatePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  templateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  emojiBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});

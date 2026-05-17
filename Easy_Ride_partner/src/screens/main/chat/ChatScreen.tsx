import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  Platform,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { ChatHeader } from '../../../components/chat/ChatHeader';
import { ChatMessageBubble, ChatMessage } from '../../../components/chat/ChatMessageBubble';
import { ChatInputBar } from '../../../components/chat/ChatInputBar';
import { TypingIndicator } from '../../../components/chat/TypingIndicator';
import { MainStackParamList } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ChatScreenRouteProp = RouteProp<MainStackParamList, 'Chat'>;
type ChatScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const flatListRef = useRef<FlatList>(null);

  // Simulated passenger profile based on route parameters
  const passengerName = 'Alex Mercer';
  const passengerRating = '4.9';
  const passengerAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm waiting at the arrivals terminal gate 4.",
      sender: 'customer',
      timestamp: '10:40 AM',
    },
    {
      id: '2',
      text: "OK, got it. I'm arriving in about 3 minutes. I have a black sedan.",
      sender: 'rider',
      timestamp: '10:41 AM',
      status: 'read',
    },
    {
      id: '3',
      text: "Perfect, see you soon!",
      sender: 'customer',
      timestamp: '10:42 AM',
    },
  ]);

  const [isPassengerTyping, setIsPassengerTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isPassengerTyping]);

  // Simulate passenger typing response after rider sends a message
  const simulatePassengerReply = () => {
    setIsPassengerTyping(true);
    setTimeout(() => {
      setIsPassengerTyping(false);
      const reply: ChatMessage = {
        id: Math.random().toString(),
        text: "Sounds good! I'll watch out for your black sedan.",
        sender: 'customer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 3000);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      text,
      sender: 'rider',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate delivery/read progression
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg))
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'read' } : msg))
      );
      // Passenger starts replying after reading
      simulatePassengerReply();
    }, 2000);
  };

  const handleShareLocation = () => {
    const locationMessage: ChatMessage = {
      id: Math.random().toString(),
      text: "Rider has shared live location coordinates.",
      sender: 'rider',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isMedia: true,
      mediaType: 'location',
    };
    setMessages((prev) => [...prev, locationMessage]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ChatHeader
        customerName={passengerName}
        customerRating={passengerRating}
        avatarUrl={passengerAvatar}
        rideScope="Active Ride • Terminal Gate 4"
        onBack={() => navigation.goBack()}
        onCall={() => {
          // Navigate to VoIP calling screen (we will register this screen too)
          navigation.navigate('HomeTabs'); // temporary fallback or handle directly
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isPassengerTyping ? <TypingIndicator /> : null}
        />

        <ChatInputBar
          onSend={handleSendMessage}
          onSendLocation={handleShareLocation}
          loading={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
export default ChatScreen;

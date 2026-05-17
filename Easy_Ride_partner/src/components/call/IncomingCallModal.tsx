import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface IncomingCallModalProps {
  visible: boolean;
  customerName: string;
  customerRating?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  visible,
  customerName,
  customerRating = '4.8',
  onAccept,
  onDecline,
}) => {
  const { theme } = useTheme();
  
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const pulseOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.4,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0.6);
      pulseOpacity.setValue(1);
    }
  }, [visible, pulseAnim, pulseOpacity]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: 'rgba(17,17,17,0.95)' }]}>
        <View style={styles.content}>
          <Text style={[styles.incomingText, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
            INCOMING VOICE CALL
          </Text>

          {/* Pulsing Avatar Container */}
          <View style={styles.avatarWrapper}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  borderColor: theme.colors.primary,
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            <View style={[styles.avatar, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="person" size={50} color={theme.colors.textSecondary} />
            </View>
          </View>

          <Text style={[styles.name, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold }]}>
            {customerName}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F5B800" />
            <Text style={[styles.rating, { color: 'rgba(255, 255, 255, 0.7)', fontFamily: theme.typography.fontFamily.medium }]}>
              {customerRating} • Passenger
            </Text>
          </View>
        </View>

        {/* Buttons footer */}
        <View style={styles.footer}>
          <View style={styles.btnCol}>
            <TouchableOpacity
              onPress={onDecline}
              style={[styles.actionBtn, { backgroundColor: theme.colors.danger }]}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={32} color={theme.colors.white} />
            </TouchableOpacity>
            <Text style={[styles.btnLabel, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium }]}>
              Decline
            </Text>
          </View>

          <View style={styles.btnCol}>
            <TouchableOpacity
              onPress={onAccept}
              style={[styles.actionBtn, { backgroundColor: theme.colors.success }]}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={32} color={theme.colors.white} />
            </TouchableOpacity>
            <Text style={[styles.btnLabel, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium }]}>
              Accept
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  incomingText: {
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 40,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  name: {
    fontSize: 28,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    gap: 40,
  },
  btnCol: {
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  btnLabel: {
    fontSize: 14,
    opacity: 0.9,
  },
});

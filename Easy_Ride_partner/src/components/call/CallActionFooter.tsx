import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CallControlButton } from './CallControlButton';
import { useTheme } from '../../theme';

interface CallActionFooterProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  isKeypadVisible: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onToggleKeypad: () => void;
  onHangup: () => void;
}

export const CallActionFooter: React.FC<CallActionFooterProps> = ({
  isMuted,
  isSpeakerOn,
  isKeypadVisible,
  onToggleMute,
  onToggleSpeaker,
  onToggleKeypad,
  onHangup,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.gridRow}>
        <CallControlButton
          icon={isMuted ? 'mic-off' : 'mic'}
          label="Mute"
          onPress={onToggleMute}
          isActive={isMuted}
        />
        <CallControlButton
          icon="keypad"
          label="Keypad"
          onPress={onToggleKeypad}
          isActive={isKeypadVisible}
        />
        <CallControlButton
          icon={isSpeakerOn ? 'volume-high' : 'volume-medium'}
          label="Speaker"
          onPress={onToggleSpeaker}
          isActive={isSpeakerOn}
        />
      </View>
      
      <View style={styles.hangupRow}>
        <CallControlButton
          icon="close"
          label="End Call"
          onPress={onHangup}
          isDanger
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  hangupRow: {
    marginTop: 10,
    alignItems: 'center',
  },
});

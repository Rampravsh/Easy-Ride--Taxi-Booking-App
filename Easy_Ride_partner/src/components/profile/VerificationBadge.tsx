import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface VerificationBadgeProps {
  verified: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verified }) => {
  const { theme } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: verified ? 'rgba(76, 175, 80, 0.15)' : 'rgba(229, 57, 53, 0.15)',
          borderColor: verified ? theme.colors.success : theme.colors.danger,
        }
      ]}
    >
      <Ionicons 
        name={verified ? 'checkmark-circle' : 'alert-circle'} 
        size={14} 
        color={verified ? theme.colors.success : theme.colors.danger} 
        style={{ marginRight: 4 }}
      />
      <Text 
        style={[
          styles.text, 
          { color: verified ? theme.colors.success : theme.colors.danger }
        ]}
      >
        {verified ? 'VERIFIED' : 'PENDING'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
export default VerificationBadge;

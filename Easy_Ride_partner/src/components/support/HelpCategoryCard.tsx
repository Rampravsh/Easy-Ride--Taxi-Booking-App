import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface HelpCategoryCardProps {
  icon: string;
  title: string;
  onPress: () => void;
}

export const HelpCategoryCard: React.FC<HelpCategoryCardProps> = ({
  icon,
  title,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
      </View>
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily.medium,
          },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
});

import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface NotificationFilterTabsProps {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
  tabs: { key: string; label: string }[];
}

export const NotificationFilterTabs: React.FC<NotificationFilterTabsProps> = ({
  selectedTab,
  onSelectTab,
  tabs,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.labelText,
                {
                  color: isSelected ? theme.colors.black : theme.colors.textSecondary,
                  fontFamily: isSelected ? theme.typography.fontFamily.semiBold : theme.typography.fontFamily.medium,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 13,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface SelectorOption<T> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

interface PreferenceSelectorProps<T> {
  title?: string;
  options: SelectorOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export const PreferenceSelector = <T extends string | number>({
  title,
  options,
  selectedValue,
  onSelect,
}: PreferenceSelectorProps<T>) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {title && (
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {title}
        </Text>
      )}
      <View style={styles.optionsList}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={option.value.toString()}
              style={[
                styles.optionCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                {option.icon && (
                  <View
                    style={[
                      styles.iconBg,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(245, 184, 0, 0.15)'
                          : theme.colors.surface,
                      },
                    ]}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                    />
                  </View>
                )}
                <View style={styles.textGroup}>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: theme.colors.text,
                        fontFamily: isSelected
                          ? theme.typography.fontFamily.semiBold
                          : theme.typography.fontFamily.medium,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text
                      style={[
                        styles.optionDesc,
                        {
                          color: theme.colors.textSecondary,
                          fontFamily: theme.typography.fontFamily.regular,
                        },
                      ]}
                    >
                      {option.description}
                    </Text>
                  )}
                </View>
              </View>
              
              <View
                style={[
                  styles.outerCircle,
                  {
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                {isSelected && (
                  <View
                    style={[
                      styles.innerCircle,
                      {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textGroup: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
  },
  optionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SettingsItemProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
  showBorder?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  rightElement,
  onPress,
  showArrow = true,
  destructive = false,
  style,
  showBorder = true,
}) => {
  const { theme } = useTheme();
  
  const isPressable = typeof onPress === 'function';
  const Wrapper = isPressable ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      disabled={!isPressable}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: showBorder ? 1 : 0,
        },
        style,
      ]}
    >
      <View style={styles.leftContainer}>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: iconBgColor || (destructive ? 'rgba(255, 69, 58, 0.1)' : theme.colors.surface),
              },
            ]}
          >
            <Ionicons
              name={icon as any}
              size={20}
              color={iconColor || (destructive ? theme.colors.danger : theme.colors.text)}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: destructive ? theme.colors.danger : theme.colors.text,
                fontFamily: theme.typography.fontFamily.medium,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={[
                styles.description,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        {rightElement}
        {isPressable && showArrow && !rightElement && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textSecondary}
          />
        )}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 64,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps, 
  StyleProp, 
  ViewStyle 
} from 'react-native';
import { useTheme, spacing, typography, radius } from '../../theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <View 
        style={[
          styles.inputWrapper, 
          { 
            backgroundColor: theme.colors.card, 
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderWidth: 1,
          }
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.size.body,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: typography.size.small,
    marginTop: spacing.xs,
    marginLeft: 4,
  },
});

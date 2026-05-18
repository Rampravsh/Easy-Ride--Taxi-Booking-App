import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface RetryFallbackProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  onGoBack?: () => void;
}

/**
 * Reusable Premium Error Fallback Display Component.
 * Used for screen level retries, connection errors, and global crash boundaries.
 */
export const RetryFallback: React.FC<RetryFallbackProps> = ({
  title = 'Something went wrong',
  message = 'A critical error occurred while executing this operation.',
  onRetry,
  onGoBack,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFF5F5' }]}>
          <Ionicons name="warning" size={48} color={theme.colors.danger} />
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>

        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        {onGoBack && (
          <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.colors.border }]}
            onPress={onGoBack}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.text }]}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  retryButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RetryFallback;

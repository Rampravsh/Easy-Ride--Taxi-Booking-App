import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import crashService from '../services/crash.service';
import RetryFallback from './RetryFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enterprise-grade Class-based React Error Boundary.
 * Captures React rendering crashes, passes diagnostics to Sentry,
 * and renders a recovery view instead of freezing the device UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 [ErrorBoundary] Caught rendering exception:', error, errorInfo);
    
    // Log crash details to centralized crashService
    crashService.logFatalCrash(error, errorInfo.componentStack || '');
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <RetryFallback
            title="App crashed unexpectedly"
            message={
              this.state.error?.message ||
              'A critical rendering crash was intercepted. The details have been reported to our operations team.'
            }
            onRetry={this.handleReset}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ErrorBoundary;

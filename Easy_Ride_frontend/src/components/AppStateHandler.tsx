import React, { useEffect } from 'react';
import networkService from '../services/network.service';
import lifecycleService from '../services/lifecycle.service';
import analyticsService from '../services/analytics.service';
import crashService from '../services/crash.service';

/**
 * Global Invisible Root Orchestration Component.
 * Initializes all device listeners (network, AppState transitions) in a unified location,
 * preventing memory leaks and duplicate socket/NetInfo subscriptions.
 */
export const AppStateHandler: React.FC = () => {
  useEffect(() => {
    console.log('🏁 [AppStateHandler] Initializing core enterprise services...');

    // 1. Initialise analytics and crash abstractions
    analyticsService.initialize();
    crashService.initialize();

    // 2. Start NetInfo event listeners
    networkService.initialize();

    // 3. Start AppState foreground/background listeners
    lifecycleService.initialize();

    return () => {
      console.log('🔌 [AppStateHandler] Tearing down core enterprise services...');
      networkService.destroy();
      lifecycleService.destroy();
    };
  }, []);

  return null;
};

export default AppStateHandler;

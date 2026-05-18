import { useCallback } from 'react';
import { useAppSelector } from '../redux/hooks';
import socketService from '../services/socket.service';
import analyticsService from '../services/analytics.service';

/**
 * Custom hook to manage realtime Socket.IO status monitoring, latency benchmarks,
 * and room rejoining triggers.
 */
export const useRealtimeRecovery = () => {
  const connected = useAppSelector((state) => state.socket.connected);
  const reconnecting = useAppSelector((state) => state.socket.reconnecting);
  const connectionState = useAppSelector((state) => state.socket.connectionState);
  const latency = useAppSelector((state) => state.socket.socketLatency);
  const currentRideRoom = useAppSelector((state) => state.socket.currentRideRoom);

  /**
   * Triggers a manual token refresh and socket reconnection.
   */
  const triggerManualRecovery = useCallback(async () => {
    console.log('🔄 [useRealtimeRecovery] Manual socket connection recovery triggered');
    analyticsService.trackEvent('socket_manual_recovery_triggered', {
      currentRoom: currentRideRoom,
      latency,
    });

    try {
      // Disconnect and reconnect using fresh token
      socketService.disconnect();
      await socketService.connect();
      console.log('✅ [useRealtimeRecovery] Manual socket connection recovery succeeded');
    } catch (err) {
      console.error('❌ [useRealtimeRecovery] Manual recovery failed:', err);
    }
  }, [currentRideRoom, latency]);

  return {
    connected,
    reconnecting,
    connectionState,
    latency,
    currentRideRoom,
    triggerManualRecovery,
  };
};

export default useRealtimeRecovery;

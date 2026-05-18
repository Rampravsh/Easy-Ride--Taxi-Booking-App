import { useAppSelector } from '../redux/hooks';

/**
 * Custom hook to monitor device network connection indicators
 * and offline retry queues.
 */
export const useNetworkStatus = () => {
  const isOnline = useAppSelector((state) => state.network.isOnline);
  const connectionType = useAppSelector((state) => state.network.connectionType);
  const isReconnecting = useAppSelector((state) => state.network.isReconnecting);
  const retryQueueLength = useAppSelector((state) => state.network.retryQueue.length);

  return {
    isOnline,
    connectionType,
    isReconnecting,
    hasPendingRetries: retryQueueLength > 0,
    retryQueueLength,
  };
};

export default useNetworkStatus;

import { useAppSelector } from '../redux/hooks';

/**
 * Custom hook to monitor application foreground/background stages.
 */
export const useAppLifecycle = () => {
  const isForeground = useAppSelector((state) => state.app.isForeground);

  return {
    isForeground,
    isBackground: !isForeground,
  };
};

export default useAppLifecycle;

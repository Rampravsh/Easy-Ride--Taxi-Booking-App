import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';
import { store } from '../redux/store';
import analyticsService from './analytics.service';

/**
 * Enterprise Navigation Deep Linking Configuration and Event Router.
 */
class DeepLinkService {
  private prefixes: string[] = [];

  public initialize() {
    this.prefixes = [Linking.createURL('/'), 'easyride://'];
    console.log('🔗 [DeepLinkService] Initialized linking prefixes:', this.prefixes);
  }

  /**
   * Generates standard React Navigation deep linking configurations
   * matching user profiles and safety compliance screens.
   */
  public getLinkingConfig(navigationRef: any): LinkingOptions<any> {
    return {
      prefixes: this.prefixes,
      config: {
        screens: {
          Main: {
            screens: {
              RideTracking: 'ride/:id',
              Wallet: 'wallet',
              Complain: 'complain',
              Chat: 'chat/:rideId',
              Notifications: 'notifications',
            },
          },
          Auth: {
            screens: {
              Login: 'login',
            },
          },
        },
      },
      /**
       * Incept deep link paths and redirect safely depending on auth states.
       */
      subscribe(listener: (url: string) => void) {
        const onReceiveURL = ({ url }: { url: string }) => {
          analyticsService.trackEvent('deep_link_clicked', { url });
          console.log('🔗 [DeepLinkService] Intercepted deep link URL:', url);
          
          // Verify user authorization before redirecting to secure main areas
          const isAuthenticated = store.getState().auth.authenticated;
          const parsed = Linking.parse(url);
          
          if (!isAuthenticated && parsed.path !== 'login') {
            console.log('🔒 [DeepLinkService] Intercepted link to protected screen, redirecting to login');
            // Redirect unauthorized users safely to the login screen
            listener(Linking.createURL('login'));
          } else {
            listener(url);
          }
        };

        // Listen for incoming deep link triggers while app is open
        const subscription = Linking.addEventListener('url', onReceiveURL);

        // Capture cold-start URL deep links that launched the application
        Linking.getInitialURL()
          .then((initialUrl) => {
            if (initialUrl) {
              onReceiveURL({ url: initialUrl });
            }
          })
          .catch((err) => {
            console.warn('[DeepLinkService] Failed to get initial deep link URL:', err);
          });

        return () => {
          subscription.remove();
        };
      },
    };
  }
}

export const deepLinkService = new DeepLinkService();
export default deepLinkService;

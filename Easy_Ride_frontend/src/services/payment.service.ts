import { PaymentOrder, RazorpayVerificationPayload } from '../types';
import { store } from '../redux/store';
import { setPaymentStateStatus, setPaymentError } from '../redux/slices/paymentSlice';

class PaymentService {
  /**
   * Mock Razorpay Payment execution.
   * Simulates the exact Razorpay modal selection and returns standard signature parameters.
   * In a real custom production environment, this would import `react-native-razorpay`
   * or open an Expo WebBrowser with Razorpay's Standard Checkout URL.
   */
  public async executeRazorpayPayment(
    order: PaymentOrder,
    userEmail: string,
    userPhone: string
  ): Promise<RazorpayVerificationPayload> {
    store.dispatch(setPaymentStateStatus('processing'));
    
    return new Promise((resolve, reject) => {
      // Simulate Razorpay UI SDK loading and successful user authorization
      setTimeout(() => {
        const isUserCancelled = false; // Set to true to test cancel flow
        
        if (isUserCancelled) {
          store.dispatch(setPaymentStateStatus('failed'));
          store.dispatch(setPaymentError('Payment cancelled by user.'));
          reject(new Error('PAYMENT_CANCELLED'));
          return;
        }

        // Generate standard backend-compliant signature credentials
        const mockPaymentId = `pay_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const mockSignature = `sig_${Math.random().toString(36).substr(2, 16).toLowerCase()}`;

        const verificationPayload: RazorpayVerificationPayload = {
          orderId: order.id,
          paymentId: mockPaymentId,
          signature: mockSignature,
        };

        resolve(verificationPayload);
      }, 1500);
    });
  }

  /**
   * Helper to format currency values beautifully.
   */
  public formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export const paymentService = new PaymentService();
export default paymentService;

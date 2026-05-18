import { store } from '../redux/store';

class WalletService {
  /**
   * Formats the wallet balance with standard currency formatting.
   */
  public formatBalance(balance: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(balance);
  }

  /**
   * Decides if the wallet balance is sufficient for a specific ride fare.
   */
  public hasSufficientBalance(fare: number): boolean {
    const state = store.getState();
    const balance = state.wallet.balance;
    return balance >= fare;
  }
}

export const walletService = new WalletService();
export default walletService;

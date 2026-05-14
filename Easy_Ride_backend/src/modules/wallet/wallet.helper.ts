/**
 * Wallet Helper
 */
export class WalletHelper {
  /**
   * Calculate fees or commissions if any
   */
  static calculateProcessingFee(amount: number) {
    // Example: 2% processing fee
    return amount * 0.02;
  }

  /**
   * Format currency (utility)
   */
  static formatCurrency(amount: number, currency: string = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
}

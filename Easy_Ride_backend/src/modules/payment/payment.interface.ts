export interface IPaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface IPaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface IRefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
}

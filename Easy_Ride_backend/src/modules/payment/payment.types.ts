export type RazorpayOrderOptions = {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type WebhookEvent = {
  event: string;
  payload: any;
  created_at: number;
};

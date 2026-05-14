export const rideAcceptedTemplate = (riderName: string) => ({
  title: 'Ride Accepted!',
  body: `Rider ${riderName} has accepted your ride and is on the way.`,
});

export const rideArrivedTemplate = () => ({
  title: 'Rider Arrived!',
  body: 'Your rider has arrived at the pickup location.',
});

export const rideStartedTemplate = () => ({
  title: 'Ride Started',
  body: 'Your ride has started. Have a safe journey!',
});

export const rideCompletedTemplate = (amount: number) => ({
  title: 'Ride Completed',
  body: `You have reached your destination. Total fare: ₹${amount}`,
});

export const paymentSuccessTemplate = (amount: number) => ({
  title: 'Payment Successful',
  body: `Payment of ₹${amount} received successfully.`,
});

export const refundProcessedTemplate = (amount: number) => ({
  title: 'Refund Processed',
  body: `A refund of ₹${amount} has been processed back to your wallet.`,
});

export const genericTemplate = (title: string, body: string) => ({
  title,
  body,
});

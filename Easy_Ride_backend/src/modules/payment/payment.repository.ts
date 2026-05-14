import { ClientSession, Types } from 'mongoose';
import { Transaction } from '../transaction/transaction.model';

export class PaymentRepository {
  /**
   * Payment repository often interacts with transaction records
   * but can also handle specific payment gateway logs or session data.
   */
  async findTransactionByOrderId(orderId: string) {
    return await Transaction.findOne({ gatewayOrderId: orderId });
  }

  async updatePaymentDetails(
    transactionId: Types.ObjectId, 
    details: { paymentId: string; signature: string },
    session?: ClientSession
  ) {
    return await Transaction.findByIdAndUpdate(
      transactionId,
      { 
        $set: { 
          gatewayPaymentId: details.paymentId,
          gatewaySignature: details.signature,
          status: 'success'
        } 
      },
      { new: true, session }
    );
  }
}

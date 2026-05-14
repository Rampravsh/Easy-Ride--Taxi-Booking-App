import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { topupSchema, verifyPaymentSchema } from '../wallet/wallet.validation';
import { refundSchema } from './payment.validation';

const router = Router();

// Webhook doesn't require authentication (it uses signature verification)
router.post('/webhook', PaymentController.razorpayWebhook);

// Protected routes
router.use(protect);


router.post('/create-order', validate(topupSchema), PaymentController.createTopupOrder);
router.post('/verify', validate(verifyPaymentSchema), PaymentController.verifyTopupPayment);
router.post('/refund', validate(refundSchema), PaymentController.refundPayment);

export default router;

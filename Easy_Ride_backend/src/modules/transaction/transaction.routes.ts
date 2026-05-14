import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);


router.get('/', TransactionController.getMyTransactions);
router.get('/:transactionId', TransactionController.getTransaction);

export default router;

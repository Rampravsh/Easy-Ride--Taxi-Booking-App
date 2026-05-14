import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { topupSchema } from './wallet.validation';

const router = Router();

// All routes require authentication
router.use(protect);


router.get('/', WalletController.getWallet);
router.get('/transactions', WalletController.getWalletTransactions);

export default router;

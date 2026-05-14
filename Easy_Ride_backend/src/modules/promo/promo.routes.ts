import { Router } from 'express';
import { PromoController } from './promo.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { validatePromoSchema } from './promo.validation';

const router = Router();

router.use(protect);

router.post('/validate', validate(validatePromoSchema), PromoController.validate);
router.post('/apply', validate(validatePromoSchema), PromoController.apply);

export default router;

import { Router } from 'express';
import { ReviewController } from './review.controller';
import { validate } from '../../middlewares/validation.middleware';
import { reviewValidation } from './review.validation';
import { protect as authenticate } from '../../middlewares/auth.middleware';


const router = Router();

router.use(authenticate);

router.post(
  '/',
  validate(reviewValidation.createReview),
  ReviewController.createReview
);

router.get('/ride/:rideId', ReviewController.getRideReviews);
router.get('/user/:userId', ReviewController.getUserReviews);

export default router;

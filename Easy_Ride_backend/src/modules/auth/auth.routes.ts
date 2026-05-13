import { Router } from 'express';
import { authenticateWithFirebase } from './auth.controller';
import { validate } from '../../middlewares/validation.middleware';
import { firebaseAuthSchema } from './auth.validation';

const router = Router();

/**
 * @route   POST /api/v1/auth/firebase
 * @desc    Authenticate user with Firebase token
 * @access  Public
 */
router.post('/firebase', validate(firebaseAuthSchema), authenticateWithFirebase);

export default router;

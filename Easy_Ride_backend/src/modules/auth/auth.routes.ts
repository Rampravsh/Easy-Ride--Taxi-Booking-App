import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middlewares/validation.middleware';
import { loginSchema, registerSchema } from './auth.validation';
import { authLimiter } from '../../middlewares/rateLimit.middleware';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

export default router;

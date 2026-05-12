import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middlewares/validation.middleware';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;

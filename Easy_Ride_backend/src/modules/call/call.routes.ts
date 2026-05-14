import { Router } from 'express';
import { CallController } from './call.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { initiateCallSchema, callIdParamSchema } from './call.validation';

const router = Router();

router.use(protect);

router.post('/initiate', validate(initiateCallSchema), CallController.initiateCall);
router.post('/:callId/accept', validate(callIdParamSchema), CallController.acceptCall);
router.post('/:callId/reject', validate(callIdParamSchema), CallController.rejectCall);
router.post('/:callId/end', validate(callIdParamSchema), CallController.endCall);
router.get('/history', CallController.getHistory);

export default router;

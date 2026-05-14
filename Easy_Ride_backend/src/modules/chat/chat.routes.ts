import { Router } from 'express';
import { ChatController } from './chat.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { sendMessageSchema, getMessagesSchema } from './chat.validation';

const router = Router();

router.use(protect);

router.post('/send', validate(sendMessageSchema), ChatController.sendMessage);
router.get('/:rideId/messages', validate(getMessagesSchema), ChatController.getMessages);
router.get('/unread-count', ChatController.getUnreadCount);
router.put('/:rideId/read', ChatController.markAsRead);

export default router;

import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { 
  registerTokenSchema, 
  removeTokenSchema, 
  getHistorySchema, 
  notificationIdSchema 
} from './notification.validation';

const router = Router();

// All notification routes are protected
router.use(protect);

router.get('/', validate(getHistorySchema), NotificationController.getHistory);
router.get('/unread-count', NotificationController.getUnreadCount);
router.put('/:id/read', validate(notificationIdSchema), NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);
router.delete('/:id', validate(notificationIdSchema), NotificationController.deleteNotification);

// Device Token Management
router.post('/register-token', validate(registerTokenSchema), NotificationController.registerToken);
router.post('/remove-token', validate(removeTokenSchema), NotificationController.removeToken);

export default router;

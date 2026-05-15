import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middlewares/logger.middleware';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middlewares/rateLimit.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { setupSwagger } from './docs/swagger/swagger.setup';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import rideRoutes from './modules/ride/ride.routes';
import riderRoutes from './modules/rider/rider.routes';
import vehicleRoutes from './modules/vehicle/vehicle.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import transactionRoutes from './modules/transaction/transaction.routes';
import paymentRoutes from './modules/payment/payment.routes';
import notificationRoutes from './modules/notification/notification.routes';
import chatRoutes from './modules/chat/chat.routes';
import callRoutes from './modules/call/call.routes';
import promoRoutes from './modules/promo/promo.routes';
import scheduleRoutes from './modules/schedule/schedule.routes';
import poolRoutes from './modules/pool/pool.routes';
import adminRoutes from './modules/admin/admin.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import monitoringRoutes from './modules/monitoring/monitoring.routes';
import reviewRoutes from './modules/review/review.routes';
import { correlationMiddleware } from './modules/observability/correlation.middleware';

import { ApiResponse } from './shared/utils/apiResponse';

const app: Application = express();

// Middlewares
app.use(correlationMiddleware);
app.use(helmet());

app.use(cors());
app.use(loggerMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS

// Rate limiting
app.use('/api', apiLimiter);

// Swagger Documentation
setupSwagger(app);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/riders', riderRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/calls', callRoutes);
app.use('/api/v1/promos', promoRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/pool', poolRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/monitoring', monitoringRoutes);
app.use('/api/v1/reviews', reviewRoutes);








// Root Route
app.get('/', (req: Request, res: Response) => {
  ApiResponse.success(res, 'Welcome to Easy Ride API v1');
});

// 404 Handler
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, `Can't find ${req.originalUrl} on this server!`, 404);
});

// Global Error Handler
app.use(errorMiddleware);

export default app;

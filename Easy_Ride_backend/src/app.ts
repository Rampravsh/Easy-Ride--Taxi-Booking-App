import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// @ts-ignore
import limiter from './config/rateLimit';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import rideRoutes from './modules/ride/ride.routes';
import { ApiResponse } from './shared/responses/apiResponse';

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS

// Rate limiting
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rides', rideRoutes);

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

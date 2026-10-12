import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { requireCustomHeader } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.set('trust proxy', 1); // Render/Vercel/NGINX sit in front of the app
app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || env.clientOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS')),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
  })
);
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());
app.use(mongoSanitize()); // blocks NoSQL operator injection like { "$gt": "" }
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.use('/api', publicRoutes);
app.use('/api/auth', requireCustomHeader, authRoutes);
app.use('/api/admin', requireCustomHeader, adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

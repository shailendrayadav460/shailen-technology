import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';

const router = Router();

// Brute-force protection: 5 failed attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

router.post('/login', loginLimiter, validate(auth.loginSchema), auth.login);
router.post('/logout', auth.logout);
router.get('/me', requireAdmin, auth.me);

export default router;

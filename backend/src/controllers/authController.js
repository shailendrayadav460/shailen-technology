import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import Admin from '../models/Admin.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email').max(120),
  password: z.string().min(1, 'Password is required').max(200),
});

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.cookieSameSite,
  path: '/',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
};

// Hash used to keep response time similar when the email does not exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  const ok = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
  if (!admin || !ok) return res.status(401).json({ message: 'Incorrect email or password' });

  const token = jwt.sign({ role: 'admin' }, env.jwtSecret, {
    algorithm: 'HS256',
    subject: String(admin._id),
    expiresIn: '8h',
  });
  res.cookie(env.cookieName, token, cookieOptions);
  res.json({ admin: { email: admin.email } });
});

export const logout = (req, res) => {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined });
  res.json({ message: 'Signed out' });
};

export const me = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.adminId);
  if (!admin) return res.status(401).json({ message: 'Authentication required' });
  res.json({ admin: { email: admin.email } });
});

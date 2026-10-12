import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import * as posts from '../controllers/postController.js';
import * as messages from '../controllers/messageController.js';
import * as site from '../controllers/siteController.js';
import * as ai from '../controllers/aiController.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'AI request limit reached. Please try again in a few minutes.' },
});

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/posts', posts.listPublic);
router.get('/posts/:slug', posts.getPublic);
router.post('/contact', contactLimiter, validate(messages.contactSchema), messages.submit);

// Public read-only for dynamic sections
router.get('/services', site.listServices);
router.get('/whatwedo', site.listWhatWeDo);
router.get('/projects', site.listProjects);

// AI Chatbot endpoint
router.post('/ai/chat', aiLimiter, ai.chatWithAI);

export default router;

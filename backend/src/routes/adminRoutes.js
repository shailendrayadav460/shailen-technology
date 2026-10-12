import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as posts from '../controllers/postController.js';
import * as messages from '../controllers/messageController.js';
import * as site from '../controllers/siteController.js';

const router = Router();
router.use(requireAdmin); // every route below needs a valid admin session

router.get('/posts', posts.listAdmin);
router.post('/posts', validate(posts.postSchema), posts.create);
router.put('/posts/:id', validate(posts.postSchema), posts.update);
router.delete('/posts/:id', posts.remove);

router.get('/messages', messages.listAdmin);
router.patch('/messages/:id/read', messages.markRead);
router.delete('/messages/:id', messages.remove);

// Services CRUD
router.get('/services', site.listServices);
router.post('/services', validate(site.serviceSchema), site.createService);
router.put('/services/:id', validate(site.serviceSchema), site.updateService);
router.delete('/services/:id', site.removeService);

// What We Do CRUD
router.get('/whatwedo', site.listWhatWeDo);
router.post('/whatwedo', validate(site.whatWeDoSchema), site.createWhatWeDo);
router.put('/whatwedo/:id', validate(site.whatWeDoSchema), site.updateWhatWeDo);
router.delete('/whatwedo/:id', site.removeWhatWeDo);

// Selected Work / Projects CRUD
router.get('/projects', site.listProjects);
router.post('/projects', validate(site.projectSchema), site.createProject);
router.put('/projects/:id', validate(site.projectSchema), site.updateProject);
router.delete('/projects/:id', site.removeProject);

export default router;

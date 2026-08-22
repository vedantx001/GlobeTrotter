import express from 'express';
import { getCommunityFeed, createCommunityExperience } from '../controllers/community.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/feed', getCommunityFeed);
router.post('/experiences', authenticate, createCommunityExperience);

export default router;

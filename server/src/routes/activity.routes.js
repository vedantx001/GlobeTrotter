import express from 'express';
import { getActivitiesHandler } from '../controllers/activity.controller.js';
import { validateActivitySearch } from '../validators/activity.validator.js';

const router = express.Router();

// Public endpoint for activity search and discovery
router.get('/', validateActivitySearch, getActivitiesHandler);

export default router;

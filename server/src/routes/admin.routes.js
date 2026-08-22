import { Router } from 'express';
import { getAnalytics } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

/**
 * Route: GET /api/admin/analytics
 * Description: Fetches analytics data for the admin dashboard.
 * Access: Protected (Admin only)
 */
router.get('/analytics', authenticate, requireAdmin, getAnalytics);

export default router;

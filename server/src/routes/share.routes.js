import express from 'express';
import { shareTripHandler, getPublicTripHandler, forkTripHandler } from '../controllers/share.controller.js';
import { validateShareTrip, validateShareToken } from '../validators/share.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Generate a public sharing link (Protected Route)
router.post(
  '/:tripId/share',
  authenticate,
  validateShareTrip,
  shareTripHandler
);

// Fetch complete public trip data (Public Route)
router.get(
  '/public/:shareToken',
  validateShareToken,
  getPublicTripHandler
);

// Clone another user's public trip (Protected Route)
router.post(
  '/fork/:shareToken',
  authenticate,
  validateShareToken,
  forkTripHandler
);

export default router;

import express from 'express';
import {
  listTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/trip.controller.js';
import { validateCreateTrip, validateUpdateTrip } from '../validators/trip.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all trip routes with authentication middleware
router.use(authenticate);

router.get('/', listTrips);
router.post('/', validateCreateTrip, createTrip);
router.get('/:id', getTrip);
router.put('/:id', validateUpdateTrip, updateTrip);
router.delete('/:id', deleteTrip);

export default router;

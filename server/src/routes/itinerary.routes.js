import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getItineraryHandler,
  createStopHandler,
  updateStopHandler,
  deleteStopHandler,
  reorderStopsHandler,
  assignActivityHandler,
  deleteItineraryActivityHandler,
} from '../controllers/itinerary.controller.js';
import {
  validateTripId,
  validateCreateStop,
  validateUpdateStop,
  validateDeleteStop,
  validateReorderStops,
  validateAssignActivity,
  validateDeleteItineraryActivity,
} from '../validators/itinerary.validator.js';

const router = express.Router();

// Protect all itinerary endpoints with authentication
router.use(authenticate);

// Activity routes
router.post('/stops/:stopId/activities', validateAssignActivity, assignActivityHandler);
router.delete('/activities/:itineraryActivityId', validateDeleteItineraryActivity, deleteItineraryActivityHandler);

// Trip & Stop routes
router.get('/:tripId/itinerary', validateTripId, getItineraryHandler);
router.post('/:tripId/stops', validateCreateStop, createStopHandler);
router.put('/:tripId/stops/reorder', validateReorderStops, reorderStopsHandler);
router.put('/:tripId/stops/:stopId', validateUpdateStop, updateStopHandler);
router.delete('/:tripId/stops/:stopId', validateDeleteStop, deleteStopHandler);

export default router;

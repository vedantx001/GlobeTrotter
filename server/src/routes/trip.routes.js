import express from 'express';
import * as tripCtrl from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', tripCtrl.getTrips);
router.post('/', tripCtrl.createTrip);
router.get('/:tripId/itinerary', tripCtrl.getTripItinerary);
router.put('/:tripId', tripCtrl.updateTrip);
router.delete('/:tripId', tripCtrl.deleteTrip);

router.post('/:tripId/stops', tripCtrl.addTripStop);
router.delete('/:tripId/stops/:stopId', tripCtrl.deleteTripStop);
router.put('/:tripId/stops/reorder', tripCtrl.reorderTripStops);

router.post('/stops/:stopId/activities', tripCtrl.addItineraryActivity);
router.delete('/activities/:activityId', tripCtrl.removeItineraryActivity);

export default router;

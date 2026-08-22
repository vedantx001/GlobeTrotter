import * as tripService from '../services/trip.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getTrips = asyncHandler(async (req, res) => {
  const data = await tripService.getTrips(req.user.id);
  return successResponse(res, 200, 'Trips fetched', data);
});

export const createTrip = asyncHandler(async (req, res) => {
  const data = await tripService.createTrip(req.user.id, req.body);
  return successResponse(res, 201, 'Trip created', data);
});

export const getTripItinerary = asyncHandler(async (req, res) => {
  const data = await tripService.getTripItinerary(req.params.tripId, req.user.id);
  return successResponse(res, 200, 'Itinerary fetched', data);
});

export const updateTrip = asyncHandler(async (req, res) => {
  const data = await tripService.updateTrip(req.params.tripId, req.user.id, req.body);
  return successResponse(res, 200, 'Trip updated', data);
});

export const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.params.tripId, req.user.id);
  return successResponse(res, 200, 'Trip deleted');
});

export const addTripStop = asyncHandler(async (req, res) => {
  const data = await tripService.addTripStop(req.params.tripId, req.user.id, req.body);
  return successResponse(res, 201, 'Stop added', data);
});

export const deleteTripStop = asyncHandler(async (req, res) => {
  await tripService.deleteTripStop(req.params.tripId, req.params.stopId, req.user.id);
  return successResponse(res, 200, 'Stop deleted');
});

export const reorderTripStops = asyncHandler(async (req, res) => {
  await tripService.reorderTripStops(req.params.tripId, req.user.id, req.body);
  return successResponse(res, 200, 'Stops reordered');
});

export const addItineraryActivity = asyncHandler(async (req, res) => {
  const data = await tripService.addItineraryActivity(req.params.stopId, req.user.id, req.body);
  return successResponse(res, 201, 'Activity added', data);
});

export const removeItineraryActivity = asyncHandler(async (req, res) => {
  await tripService.removeItineraryActivity(req.params.activityId, req.user.id);
  return successResponse(res, 200, 'Activity removed');
});

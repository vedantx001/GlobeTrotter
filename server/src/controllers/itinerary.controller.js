import * as itineraryService from '../services/itinerary.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getItineraryHandler = asyncHandler(async (req, res) => {
  try {
    const itinerary = await itineraryService.getItinerary(req.user.id, req.params.tripId);
    if (!itinerary) {
      return errorResponse(res, 404, 'Trip not found.');
    }
    return successResponse(res, 200, 'Itinerary fetched successfully.', { itinerary });
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message || 'Failed to fetch itinerary.');
  }
});

export const createStopHandler = asyncHandler(async (req, res) => {
  try {
    const stop = await itineraryService.createStop(req.user.id, req.params.tripId, req.body);
    return successResponse(res, 201, 'Trip stop added successfully.', { stop });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to add trip stop.');
  }
});

export const updateStopHandler = asyncHandler(async (req, res) => {
  try {
    const stop = await itineraryService.updateStop(
      req.user.id,
      req.params.tripId,
      req.params.stopId,
      req.body
    );
    return successResponse(res, 200, 'Trip stop updated successfully.', { stop });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to update trip stop.');
  }
});

export const deleteStopHandler = asyncHandler(async (req, res) => {
  try {
    await itineraryService.deleteStop(req.user.id, req.params.tripId, req.params.stopId);
    return successResponse(res, 200, 'Trip stop deleted successfully.');
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to delete trip stop.');
  }
});

export const reorderStopsHandler = asyncHandler(async (req, res) => {
  try {
    const stops = await itineraryService.reorderStops(
      req.user.id,
      req.params.tripId,
      req.body.stops
    );
    return successResponse(res, 200, 'Trip stops reordered successfully.', { stops });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to reorder trip stops.');
  }
});

export const assignActivityHandler = asyncHandler(async (req, res) => {
  try {
    const itineraryActivity = await itineraryService.assignActivity(
      req.user.id,
      req.params.stopId,
      req.body
    );
    return successResponse(res, 201, 'Activity assigned successfully.', { itineraryActivity });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to assign activity.');
  }
});

export const deleteItineraryActivityHandler = asyncHandler(async (req, res) => {
  try {
    await itineraryService.deleteItineraryActivity(
      req.user.id,
      req.params.itineraryActivityId
    );
    return successResponse(res, 200, 'Itinerary activity removed successfully.');
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to remove itinerary activity.');
  }
});

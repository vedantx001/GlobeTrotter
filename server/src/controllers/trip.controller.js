import * as tripService from '../services/trip.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listTrips = asyncHandler(async (req, res) => {
  try {
    const trips = await tripService.getUserTrips(req.user.id);
    return successResponse(res, 200, 'Trips fetched successfully.', { trips });
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message || 'Failed to fetch trips.');
  }
});

export const createTrip = asyncHandler(async (req, res) => {
  try {
    const trip = await tripService.createTrip(req.user.id, req.body);
    return successResponse(res, 201, 'Trip created successfully.', { trip });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to create trip.');
  }
});

export const getTrip = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await tripService.getTripById(req.user.id, id);

    if (!trip) {
      return errorResponse(res, 404, 'Trip not found.');
    }

    return successResponse(res, 200, 'Trip fetched successfully.', { trip });
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message || 'Failed to fetch trip.');
  }
});

export const updateTrip = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await tripService.updateTrip(req.user.id, id, req.body);

    if (!trip) {
      return errorResponse(res, 404, 'Trip not found.');
    }

    return successResponse(res, 200, 'Trip updated successfully.', { trip });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message || 'Failed to update trip.');
  }
});

export const deleteTrip = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await tripService.deleteTrip(req.user.id, id);

    if (!deleted) {
      return errorResponse(res, 404, 'Trip not found.');
    }

    return successResponse(res, 200, 'Trip deleted successfully.');
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message || 'Failed to delete trip.');
  }
});

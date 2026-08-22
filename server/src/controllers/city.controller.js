import * as cityService from '../services/city.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCities = asyncHandler(async (req, res) => {
  try {
    const data = await cityService.getCities(req.query);
    return successResponse(res, 200, 'Cities fetched successfully.', data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

export const getActivities = asyncHandler(async (req, res) => {
  try {
    const data = await cityService.getActivities(req.query);
    return successResponse(res, 200, 'Activities fetched successfully.', data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

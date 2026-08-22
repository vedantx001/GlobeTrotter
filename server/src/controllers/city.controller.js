import * as cityService from '../services/city.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCities = asyncHandler(async (req, res) => {
  try {
    const data = await cityService.searchCities(req.query);
    return successResponse(res, 200, 'Cities fetched successfully.', data);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message || 'Failed to fetch cities.');
  }
});

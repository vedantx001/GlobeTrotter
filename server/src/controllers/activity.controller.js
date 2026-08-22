import * as activityService from '../services/activity.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getActivitiesHandler = asyncHandler(async (req, res) => {
  try {
    const data = await activityService.searchActivities(req.query);
    return successResponse(res, 200, 'Activities fetched successfully.', data);
  } catch (error) {
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || 'Failed to fetch activities.'
    );
  }
});

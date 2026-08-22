import * as communityService from '../services/community.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCommunityFeed = asyncHandler(async (req, res) => {
  try {
    const data = await communityService.getCommunityFeed();
    return successResponse(res, 200, 'Feed fetched successfully', data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

export const createCommunityExperience = asyncHandler(async (req, res) => {
  try {
    const data = await communityService.createCommunityExperience(req.user.id, req.body);
    return successResponse(res, 201, 'Experience published', data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

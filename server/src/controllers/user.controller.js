import * as userService from '../services/user.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const data = await userService.updateProfile(req.user.id, req.body);
    return successResponse(res, 200, 'Profile updated successfully.', data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

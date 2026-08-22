import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

/**
 * Fetch complete profile information for the authenticated user.
 */
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  try {
    const profile = await userService.getProfile(userId);
    return successResponse(res, 200, 'Profile fetched successfully', profile);
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

/**
 * Update user profile.
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await userService.updateProfile(userId, req.body);
  return successResponse(res, 200, 'Profile updated successfully', {});
});

/**
 * Return all bookmarked cities.
 */
export const getSavedDestinations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const destinations = await userService.getSavedDestinations(userId);
  return successResponse(res, 200, 'Saved destinations fetched successfully', destinations);
});

/**
 * Toggle bookmark.
 */
export const toggleSavedDestination = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { cityId } = req.params;
  
  try {
    const message = await userService.toggleSavedDestination(userId, Number(cityId));
    return successResponse(res, 200, message);
  } catch (error) {
    if (error.message === 'City not found') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

/**
 * Delete authenticated user account.
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  try {
    await userService.deleteAccount(userId);
    return successResponse(res, 200, 'Account deleted successfully');
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

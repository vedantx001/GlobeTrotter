import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as shareService from '../services/share.service.js';

/**
 * Generates a public sharing link for a trip.
 */
export const shareTripHandler = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id; // Extracted from auth middleware

  try {
    const shareToken = await shareService.shareTrip(tripId, userId);
    const shareUrl = `/trips/share/${shareToken}`;

    return successResponse(res, 200, 'Trip shared successfully', {
      shareToken,
      shareUrl
    });
  } catch (error) {
    if (error.message === 'Trip not found or unauthorized access') {
      return errorResponse(res, 403, error.message);
    }
    throw error;
  }
});

/**
 * Fetches complete public trip data for a given share token.
 */
export const getPublicTripHandler = asyncHandler(async (req, res) => {
  const { shareToken } = req.params;

  try {
    const data = await shareService.getPublicTrip(shareToken);
    
    return successResponse(res, 200, 'Public trip retrieved successfully', data);
  } catch (error) {
    if (error.message === 'Public trip not found') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

/**
 * Clones a public trip and attaches it to the authenticated user's account.
 */
export const forkTripHandler = asyncHandler(async (req, res) => {
  const { shareToken } = req.params;
  const userId = req.user.id; // Extracted from auth middleware

  try {
    const tripId = await shareService.forkTrip(shareToken, userId);

    return successResponse(res, 201, 'Trip copied successfully', {
      tripId
    });
  } catch (error) {
    if (error.message === 'Public trip not found') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

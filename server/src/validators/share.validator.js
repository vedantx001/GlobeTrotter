import { errorResponse } from '../utils/response.js';

/**
 * Validates the parameters for sharing a trip.
 */
export const validateShareTrip = (req, res, next) => {
  const { tripId } = req.params;

  if (!tripId || isNaN(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  next();
};

/**
 * Validates the parameters for accessing or forking a public trip.
 */
export const validateShareToken = (req, res, next) => {
  const { shareToken } = req.params;

  if (!shareToken || typeof shareToken !== 'string' || shareToken.trim().length === 0) {
    return errorResponse(res, 400, 'Valid shareToken is required.');
  }

  next();
};

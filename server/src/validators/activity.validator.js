import { errorResponse } from '../utils/response.js';

export const SUPPORTED_CATEGORIES = [
  'Sightseeing',
  'Food & Dining',
  'Adventure',
  'Culture',
  'Relaxation',
];

export const validateActivitySearch = (req, res, next) => {
  const {
    cityId,
    category,
    minCost,
    maxCost,
    minDuration,
    maxDuration,
    limit,
    offset,
  } = req.query;

  // Validate cityId
  if (cityId !== undefined && cityId !== '') {
    const num = Number(cityId);
    if (!Number.isInteger(num) || num <= 0) {
      return errorResponse(res, 400, 'Invalid cityId parameter. Must be a positive integer.');
    }
  }

  // Validate category
  if (category !== undefined && category !== '') {
    if (!SUPPORTED_CATEGORIES.includes(category)) {
      return errorResponse(
        res,
        400,
        `Invalid category parameter. Must be one of: ${SUPPORTED_CATEGORIES.join(', ')}.`
      );
    }
  }

  // Validate minCost & maxCost
  let parsedMinCost;
  let parsedMaxCost;

  if (minCost !== undefined && minCost !== '') {
    parsedMinCost = Number(minCost);
    if (isNaN(parsedMinCost) || parsedMinCost < 0) {
      return errorResponse(res, 400, 'Invalid minCost parameter. Must be a non-negative number.');
    }
  }

  if (maxCost !== undefined && maxCost !== '') {
    parsedMaxCost = Number(maxCost);
    if (isNaN(parsedMaxCost) || parsedMaxCost < 0) {
      return errorResponse(res, 400, 'Invalid maxCost parameter. Must be a non-negative number.');
    }
  }

  if (parsedMinCost !== undefined && parsedMaxCost !== undefined) {
    if (parsedMinCost > parsedMaxCost) {
      return errorResponse(res, 400, 'minCost cannot be greater than maxCost.');
    }
  }

  // Validate minDuration & maxDuration
  let parsedMinDuration;
  let parsedMaxDuration;

  if (minDuration !== undefined && minDuration !== '') {
    parsedMinDuration = Number(minDuration);
    if (isNaN(parsedMinDuration) || parsedMinDuration < 0) {
      return errorResponse(res, 400, 'Invalid minDuration parameter. Must be a non-negative number.');
    }
  }

  if (maxDuration !== undefined && maxDuration !== '') {
    parsedMaxDuration = Number(maxDuration);
    if (isNaN(parsedMaxDuration) || parsedMaxDuration < 0) {
      return errorResponse(res, 400, 'Invalid maxDuration parameter. Must be a non-negative number.');
    }
  }

  if (parsedMinDuration !== undefined && parsedMaxDuration !== undefined) {
    if (parsedMinDuration > parsedMaxDuration) {
      return errorResponse(res, 400, 'minDuration cannot be greater than maxDuration.');
    }
  }

  // Validate limit
  if (limit !== undefined && limit !== '') {
    const num = Number(limit);
    if (!Number.isInteger(num) || num < 1 || num > 50) {
      return errorResponse(res, 400, 'Invalid limit parameter. Must be an integer between 1 and 50.');
    }
  }

  // Validate offset
  if (offset !== undefined && offset !== '') {
    const num = Number(offset);
    if (!Number.isInteger(num) || num < 0) {
      return errorResponse(res, 400, 'Invalid offset parameter. Must be a non-negative integer.');
    }
  }

  next();
};

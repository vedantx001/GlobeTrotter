import { errorResponse } from '../utils/response.js';

export const validateCitySearch = (req, res, next) => {
  const { limit, offset, costIndex, minPopularity } = req.query;

  // Validate limit if provided
  if (limit !== undefined) {
    const parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 50) {
      return errorResponse(res, 400, 'Invalid limit parameter. Must be an integer between 1 and 50.');
    }
  }

  // Validate offset if provided
  if (offset !== undefined) {
    const parsedOffset = Number(offset);
    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return errorResponse(res, 400, 'Invalid offset parameter. Must be a non-negative integer.');
    }
  }

  // Validate costIndex if provided
  if (costIndex !== undefined) {
    const parsedCost = Number(costIndex);
    if (isNaN(parsedCost) || parsedCost < 0) {
      return errorResponse(res, 400, 'Invalid costIndex parameter. Must be a non-negative number.');
    }
  }

  // Validate minPopularity if provided
  if (minPopularity !== undefined) {
    const parsedPop = Number(minPopularity);
    if (isNaN(parsedPop) || parsedPop < 0) {
      return errorResponse(res, 400, 'Invalid minPopularity parameter. Must be a non-negative number.');
    }
  }

  next();
};

import { errorResponse } from '../utils/response.js';

/**
 * Middleware to ensure the user has the ADMIN role.
 * This must be used after the authentication middleware.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const requireAdmin = (req, res, next) => {
  // req.user is set by the authenticate middleware
  if (!req.user || req.user.role !== 'ADMIN') {
    return errorResponse(res, 403, 'Access denied. Admin privileges required.');
  }
  
  next();
};

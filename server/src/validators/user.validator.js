import { errorResponse } from '../utils/response.js';

/**
 * Validates the update profile request body.
 */
export const validateUpdateProfile = (req, res, next) => {
  const { firstName, lastName, phone, profileImage, city, country } = req.body;

  if (firstName !== undefined && firstName.trim() === '') {
    return errorResponse(res, 400, 'First name cannot be empty');
  }

  if (lastName !== undefined && lastName.trim() === '') {
    return errorResponse(res, 400, 'Last name cannot be empty');
  }

  if (phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return errorResponse(res, 400, 'Invalid phone format');
    }
  }

  if (profileImage) {
    try {
      new URL(profileImage);
    } catch (err) {
      return errorResponse(res, 400, 'Invalid URL for profile image');
    }
  }

  // Prevent updating restricted fields
  if (req.body.email) {
    return errorResponse(res, 400, 'Email cannot be changed');
  }

  if (req.body.role) {
    return errorResponse(res, 400, 'Role cannot be changed');
  }

  next();
};

/**
 * Validates the cityId parameter.
 */
export const validateCityId = (req, res, next) => {
  const { cityId } = req.params;
  
  if (!cityId || isNaN(Number(cityId))) {
    return errorResponse(res, 400, 'Valid City ID is required');
  }

  next();
};

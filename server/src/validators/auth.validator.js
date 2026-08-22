import { errorResponse } from '../utils/response.js';

export const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, phone, password, city, country } = req.body;
  
  if (!firstName || !lastName || !email || !phone || !password || !city || !country) {
    return errorResponse(res, 400, 'All required fields must be provided.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, 400, 'Invalid email format.');
  }

  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format or basic validation
  if (!phoneRegex.test(phone)) {
    return errorResponse(res, 400, 'Invalid phone format.');
  }

  if (password.length < 8) {
    return errorResponse(res, 400, 'Password must be at least 8 characters long.');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return errorResponse(res, 400, 'Identifier and password are required.');
  }

  next();
};

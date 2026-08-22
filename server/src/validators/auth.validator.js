import { errorResponse } from '../utils/response.js';

export const validateRegister = (req, res, next) => {
  const { firstName, lastName, name, email, phone, password } = req.body;
  
  if ((!firstName && !name) || !email || !password) {
    return errorResponse(res, 400, 'Name, email, and password are required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, 400, 'Invalid email format.');
  }

  if (phone) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return errorResponse(res, 400, 'Invalid phone format.');
    }
  }

  if (password.length < 6) {
    return errorResponse(res, 400, 'Password must be at least 6 characters long.');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { identifier, email, phone, password } = req.body;
  const loginIdentifier = identifier || email || phone;

  if (!loginIdentifier || !password) {
    return errorResponse(res, 400, 'Email/phone and password are required.');
  }

  next();
};


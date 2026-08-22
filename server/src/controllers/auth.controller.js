import * as authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  try {
    const data = await authService.registerUser(req.body);
    return successResponse(res, 201, 'User registered successfully.', data);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginIdentifier = identifier || email || phone;
    const data = await authService.loginUser(loginIdentifier, password);
    return successResponse(res, 200, 'User logged in successfully.', data);
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  const formattedUser = {
    ...user,
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Traveler',
    avatar: user.avatar || user.profileImage || null
  };
  return successResponse(res, 200, 'User profile fetched successfully.', {
    user: formattedUser
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return errorResponse(res, 400, 'Email address is required.');
  }
  return successResponse(res, 200, 'If an account exists, a reset link has been sent.');
});


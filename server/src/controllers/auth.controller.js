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
    const { identifier, password } = req.body;
    const data = await authService.loginUser(identifier, password);
    return successResponse(res, 200, 'User logged in successfully.', data);
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
});

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'User profile fetched successfully.', {
    user: req.user
  });
});

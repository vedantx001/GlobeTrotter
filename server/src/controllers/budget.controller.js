import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import * as budgetService from '../services/budget.service.js';

/**
 * Creates a new expense for a trip.
 */
export const createExpense = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;
  const expenseData = req.body;

  try {
    const expense = await budgetService.createExpense(tripId, userId, expenseData);
    return successResponse(res, 201, 'Expense added successfully', expense);
  } catch (error) {
    if (error.message === 'Trip not found or unauthorized access') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

/**
 * Deletes an expense.
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user.id;

  try {
    await budgetService.deleteExpense(expenseId, userId);
    return successResponse(res, 200, 'Expense deleted successfully');
  } catch (error) {
    if (error.message === 'Expense not found or unauthorized access') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

/**
 * Returns complete budget analytics for a trip.
 */
export const getBudgetSummary = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    const budgetSummary = await budgetService.getBudgetSummary(tripId, userId);
    return successResponse(res, 200, 'Budget summary fetched successfully', budgetSummary);
  } catch (error) {
    if (error.message === 'Trip not found or unauthorized access') {
      return errorResponse(res, 404, error.message);
    }
    throw error;
  }
});

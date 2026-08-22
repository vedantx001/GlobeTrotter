import { errorResponse } from '../utils/response.js';
import { VALID_EXPENSE_CATEGORIES } from '../constants/budget.constants.js';

/**
 * Validates the request body for creating a new expense.
 */
export const validateCreateExpense = (req, res, next) => {
  const { title, category, amount, expense_date } = req.body;
  const { tripId } = req.params;

  if (!tripId || isNaN(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return errorResponse(res, 400, 'Title is required and must be a valid string.');
  }

  if (!category || !VALID_EXPENSE_CATEGORIES.includes(category)) {
    return errorResponse(res, 400, `Category must be one of: ${VALID_EXPENSE_CATEGORIES.join(', ')}.`);
  }

  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
    return errorResponse(res, 400, 'Amount must be a positive number.');
  }

  if (!expense_date || isNaN(Date.parse(expense_date))) {
    return errorResponse(res, 400, 'A valid expense_date is required (e.g., YYYY-MM-DD).');
  }

  next();
};

/**
 * Validates the parameters for getting a trip's budget summary.
 */
export const validateGetBudget = (req, res, next) => {
  const { tripId } = req.params;

  if (!tripId || isNaN(tripId)) {
    return errorResponse(res, 400, 'Valid tripId is required.');
  }

  next();
};

/**
 * Validates the parameters for deleting an expense.
 */
export const validateDeleteExpense = (req, res, next) => {
  const { expenseId } = req.params;

  if (!expenseId || isNaN(expenseId)) {
    return errorResponse(res, 400, 'Valid expenseId is required.');
  }

  next();
};

import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createExpense,
  deleteExpense,
  getBudgetSummary
} from '../controllers/budget.controller.js';
import {
  validateCreateExpense,
  validateDeleteExpense,
  validateGetBudget
} from '../validators/budget.validator.js';

const router = express.Router();

/**
 * POST /api/trips/:tripId/expenses
 * Create a new expense for a trip.
 */
router.post(
  '/:tripId/expenses',
  authenticate,
  validateCreateExpense,
  createExpense
);

/**
 * DELETE /api/trips/expenses/:expenseId
 * Delete an expense.
 */
router.delete(
  '/expenses/:expenseId',
  authenticate,
  validateDeleteExpense,
  deleteExpense
);

/**
 * GET /api/trips/:tripId/budget
 * Return complete budget analytics for a trip.
 */
router.get(
  '/:tripId/budget',
  authenticate,
  validateGetBudget,
  getBudgetSummary
);

export default router;

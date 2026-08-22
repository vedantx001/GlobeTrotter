import { pool } from '../config/db.js';
import { EXPENSE_CATEGORIES } from '../constants/budget.constants.js';

/**
 * Creates a new expense for a trip.
 * @param {number} tripId - The ID of the trip.
 * @param {number} userId - The ID of the authenticated user.
 * @param {Object} expenseData - The expense details.
 * @returns {Promise<Object>} The created expense.
 */
export const createExpense = async (tripId, userId, expenseData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verify trip ownership
    const [trips] = await connection.query(
      'SELECT id FROM trips WHERE id = ? AND user_id = ? FOR UPDATE',
      [tripId, userId]
    );

    if (trips.length === 0) {
      throw new Error('Trip not found or unauthorized access');
    }

    const { title, category, amount, expense_date } = expenseData;

    // Insert expense
    const [result] = await connection.query(
      `INSERT INTO trip_expenses (trip_id, category, title, amount, expense_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [tripId, category, title, amount, expense_date]
    );

    await connection.commit();

    return {
      id: result.insertId,
      trip_id: tripId,
      title,
      category,
      amount: Number(amount),
      expense_date
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Deletes an expense.
 * @param {number} expenseId - The ID of the expense to delete.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<void>}
 */
export const deleteExpense = async (expenseId, userId) => {
  const connection = await pool.getConnection();
  try {
    // Verify expense belongs to a trip owned by the user
    const [expenses] = await connection.query(
      `SELECT e.id 
       FROM trip_expenses e 
       JOIN trips t ON e.trip_id = t.id 
       WHERE e.id = ? AND t.user_id = ?`,
      [expenseId, userId]
    );

    if (expenses.length === 0) {
      throw new Error('Expense not found or unauthorized access');
    }

    await connection.query('DELETE FROM trip_expenses WHERE id = ?', [expenseId]);
  } finally {
    connection.release();
  }
};

/**
 * Returns complete budget analytics for a trip.
 * @param {number} tripId - The ID of the trip.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<Object>} The budget summary.
 */
export const getBudgetSummary = async (tripId, userId) => {
  const connection = await pool.getConnection();
  try {
    // Verify trip ownership and get trip details
    const [trips] = await connection.query(
      'SELECT id, total_budget, start_date, end_date FROM trips WHERE id = ? AND user_id = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      throw new Error('Trip not found or unauthorized access');
    }

    const trip = trips[0];

    // Fetch all expenses for the trip
    const [expenses] = await connection.query(
      'SELECT id, category, title, amount, expense_date FROM trip_expenses WHERE trip_id = ?',
      [tripId]
    );

    // Calculate business logic
    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const tripBudget = Number(trip.total_budget || 0);
    const remainingBudget = tripBudget - totalSpent;

    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    // Duration includes both start and end date (end_date - start_date + 1)
    const tripDurationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const averageDailySpend = tripDurationDays > 0 ? Number((totalSpent / tripDurationDays).toFixed(2)) : 0;
    const percentUsed = tripBudget > 0 ? Number(((totalSpent / tripBudget) * 100).toFixed(2)) : 0;
    const isOverBudget = totalSpent > tripBudget;

    // Calculate category breakdown
    const categoryBreakdown = {
      [EXPENSE_CATEGORIES.TRANSPORT]: 0,
      [EXPENSE_CATEGORIES.ACCOMMODATION]: 0,
      [EXPENSE_CATEGORIES.ACTIVITIES]: 0,
      [EXPENSE_CATEGORIES.MEALS]: 0,
      [EXPENSE_CATEGORIES.MISC]: 0
    };

    expenses.forEach(exp => {
      if (categoryBreakdown[exp.category] !== undefined) {
        categoryBreakdown[exp.category] += Number(exp.amount);
      } else {
        categoryBreakdown[exp.category] = Number(exp.amount);
      }
    });

    return {
      tripId: Number(tripId),
      tripBudget,
      totalSpent,
      remainingBudget,
      averageDailySpend,
      tripDurationDays,
      categoryBreakdown,
      percentUsed,
      isOverBudget,
      expenses
    };
  } finally {
    connection.release();
  }
};

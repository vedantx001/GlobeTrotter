import { errorResponse } from '../utils/response.js';

const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

export const validateCreateTrip = (req, res, next) => {
  const {
    title,
    startDate,
    start_date,
    endDate,
    end_date,
    totalBudget,
    total_budget,
  } = req.body;

  // Title validation
  if (title === undefined || title === null || typeof title !== 'string' || title.trim() === '') {
    return errorResponse(res, 400, 'Trip title is required and cannot be empty.');
  }

  const rawStartDate = startDate !== undefined ? startDate : start_date;
  const rawEndDate = endDate !== undefined ? endDate : end_date;
  const rawBudget = totalBudget !== undefined ? totalBudget : total_budget;

  // Start Date validation
  if (rawStartDate !== undefined && rawStartDate !== null) {
    if (!isValidDate(rawStartDate)) {
      return errorResponse(res, 400, 'Invalid start date format.');
    }
  }

  // End Date validation
  if (rawEndDate !== undefined && rawEndDate !== null) {
    if (!isValidDate(rawEndDate)) {
      return errorResponse(res, 400, 'Invalid end date format.');
    }
  }

  // Date range validation when both are supplied
  if (rawStartDate && rawEndDate) {
    const start = new Date(rawStartDate);
    const end = new Date(rawEndDate);
    if (end < start) {
      return errorResponse(res, 400, 'End date must be greater than or equal to start date.');
    }
  }

  // Total Budget validation
  if (rawBudget !== undefined && rawBudget !== null) {
    const budgetNum = Number(rawBudget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      return errorResponse(res, 400, 'Total budget must be a non-negative number.');
    }
  }

  next();
};

export const validateUpdateTrip = (req, res, next) => {
  const {
    title,
    startDate,
    start_date,
    endDate,
    end_date,
    totalBudget,
    total_budget,
  } = req.body;

  // Title validation if present
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return errorResponse(res, 400, 'Trip title cannot be empty.');
    }
  }

  const rawStartDate = startDate !== undefined ? startDate : start_date;
  const rawEndDate = endDate !== undefined ? endDate : end_date;
  const rawBudget = totalBudget !== undefined ? totalBudget : total_budget;

  // Start Date validation if present
  if (rawStartDate !== undefined && rawStartDate !== null) {
    if (!isValidDate(rawStartDate)) {
      return errorResponse(res, 400, 'Invalid start date format.');
    }
  }

  // End Date validation if present
  if (rawEndDate !== undefined && rawEndDate !== null) {
    if (!isValidDate(rawEndDate)) {
      return errorResponse(res, 400, 'Invalid end date format.');
    }
  }

  // Date range validation if both are present in payload
  if (rawStartDate && rawEndDate) {
    const start = new Date(rawStartDate);
    const end = new Date(rawEndDate);
    if (end < start) {
      return errorResponse(res, 400, 'End date must be greater than or equal to start date.');
    }
  }

  // Total Budget validation if present
  if (rawBudget !== undefined && rawBudget !== null) {
    const budgetNum = Number(rawBudget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      return errorResponse(res, 400, 'Total budget must be a non-negative number.');
    }
  }

  next();
};

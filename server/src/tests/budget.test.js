import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing modules
jest.unstable_mockModule('../services/budget.service.js', () => ({
  createExpense: jest.fn(),
  deleteExpense: jest.fn(),
  getBudgetSummary: jest.fn(),
}));

jest.unstable_mockModule('../utils/jwt.js', () => ({
  verifyToken: jest.fn(),
}));

// Mock PrismaClient used in the auth middleware
const mPrismaClient = {
  user: {
    findUnique: jest.fn(),
  },
};

jest.unstable_mockModule('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mPrismaClient)
  };
});

// 2. Import modules dynamically after mocking
const budgetService = await import('../services/budget.service.js');
const jwtUtils = await import('../utils/jwt.js');
const budgetRoutes = (await import('../routes/budget.routes.js')).default;

// 3. Setup test express app to test the isolated router
const app = express();
app.use(express.json());
// Assuming budget routes are mounted at /api/trips
app.use('/api/trips', budgetRoutes);

// Mock data
const mockUser = { id: 1, email: 'test@example.com' };
const mockToken = 'mocked.jwt.token';

const validExpenseData = {
  title: 'Hotel Booking',
  category: 'ACCOMMODATION',
  amount: 850,
  expense_date: '2026-08-25'
};

const mockExpenseResponse = {
  id: 1,
  trip_id: 1,
  ...validExpenseData
};

const mockBudgetSummary = {
  tripId: 1,
  tripBudget: 5000,
  totalSpent: 850,
  remainingBudget: 4150,
  averageDailySpend: 425,
  tripDurationDays: 2,
  categoryBreakdown: { ACCOMMODATION: 850 },
  percentUsed: 17,
  isOverBudget: false,
  expenses: [mockExpenseResponse]
};

describe('Budget API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default auth mocks for authenticated routes
    jwtUtils.verifyToken.mockReturnValue({ id: mockUser.id });
    mPrismaClient.user.findUnique.mockResolvedValue(mockUser);
  });

  describe('POST /api/trips/:tripId/expenses', () => {
    // Test 1: Successful creation
    it('1. should create a new expense successfully', async () => {
      budgetService.createExpense.mockResolvedValue(mockExpenseResponse);

      const response = await request(app)
        .post('/api/trips/1/expenses')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(validExpenseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockExpenseResponse);
    });

    // Test 2: Validation failure (missing fields)
    it('2. should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/trips/1/expenses')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ title: 'Hotel' }); // Missing category, amount, date

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    // Test 3: Validation failure (invalid amount)
    it('3. should return 400 if amount is invalid', async () => {
      const response = await request(app)
        .post('/api/trips/1/expenses')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ ...validExpenseData, amount: -50 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Amount must be a positive number.');
    });

    // Test 4: Service error (trip not found)
    it('4. should return 404 if trip is not found or unauthorized', async () => {
      budgetService.createExpense.mockRejectedValue(new Error('Trip not found or unauthorized access'));

      const response = await request(app)
        .post('/api/trips/999/expenses')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(validExpenseData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trip not found or unauthorized access');
    });
  });

  describe('DELETE /api/trips/expenses/:expenseId', () => {
    // Test 5: Successful deletion
    it('5. should delete an expense successfully', async () => {
      budgetService.deleteExpense.mockResolvedValue();

      const response = await request(app)
        .delete('/api/trips/expenses/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Expense deleted successfully');
    });

    // Test 6: Validation failure (invalid id)
    it('6. should return 400 if expenseId is not a valid number', async () => {
      const response = await request(app)
        .delete('/api/trips/expenses/abc')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Valid expenseId is required.');
    });

    // Test 7: Service error (expense not found)
    it('7. should return 404 if expense is not found or unauthorized', async () => {
      budgetService.deleteExpense.mockRejectedValue(new Error('Expense not found or unauthorized access'));

      const response = await request(app)
        .delete('/api/trips/expenses/999')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Expense not found or unauthorized access');
    });
  });

  describe('GET /api/trips/:tripId/budget', () => {
    // Test 8: Successful retrieval
    it('8. should return budget summary successfully', async () => {
      budgetService.getBudgetSummary.mockResolvedValue(mockBudgetSummary);

      const response = await request(app)
        .get('/api/trips/1/budget')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockBudgetSummary);
    });

    // Test 9: Validation failure (invalid trip id)
    it('9. should return 400 if tripId is not a valid number', async () => {
      const response = await request(app)
        .get('/api/trips/abc/budget')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Valid tripId is required.');
    });
  });

  describe('Authentication and Security', () => {
    // Test 10: Unauthorized access (no token)
    it('10. should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get('/api/trips/1/budget'); // No Authorization header

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });
});

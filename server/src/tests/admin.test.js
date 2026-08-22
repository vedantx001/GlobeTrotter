import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing the modules that depend on them
jest.unstable_mockModule('../services/admin.service.js', () => ({
  getAnalyticsData: jest.fn(),
}));

jest.unstable_mockModule('../utils/jwt.js', () => ({
  verifyToken: jest.fn(),
}));

// Mock Prisma for the auth middleware
const mPrisma = {
  user: {
    findUnique: jest.fn(),
  },
};

jest.unstable_mockModule('../config/prisma.js', () => ({
  default: mPrisma,
}));

// 2. Import modules dynamically after mocking
const adminService = await import('../services/admin.service.js');
const jwtUtils = await import('../utils/jwt.js');
const adminRoutes = (await import('../routes/admin.routes.js')).default;

// 3. Setup test express app with the isolated router
const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

// --- Mock Data ---
const validAdminUser = {
  id: 1,
  email: 'admin@example.com',
  role: 'ADMIN'
};

const validNormalUser = {
  id: 2,
  email: 'user@example.com',
  role: 'USER'
};

const mockAnalyticsData = {
  summary: {
    totalUsers: 10,
    totalTrips: 5,
    totalActivitiesPlanned: 20,
    publicTrips: 2
  },
  popularCities: [{ cityId: 1, cityName: 'Paris', tripCount: 3 }],
  popularActivities: [{ activityId: 1, title: 'Eiffel Tower', usageCount: 2 }],
  recentTrips: [{ tripId: 1, tripTitle: 'Summer Vacation', userName: 'John Doe', createdAt: new Date() }]
};

const emptyAnalyticsData = {
  summary: { totalUsers: 0, totalTrips: 0, totalActivitiesPlanned: 0, publicTrips: 0 },
  popularCities: [],
  popularActivities: [],
  recentTrips: []
};

describe('Admin Analytics API (GET /api/admin/analytics)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Authentication failure (No token)
  it('1. Should return 401 if no authorization token is provided', async () => {
    const response = await request(app).get('/api/admin/analytics');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Access denied. No token provided.');
  });

  // Test 2: Authentication failure (Invalid token)
  it('2. Should return 401 if the provided token is invalid', async () => {
    jwtUtils.verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid or expired token.');
  });

  // Test 3: Authentication failure (User not found)
  it('3. Should return 401 if the user associated with token is not found in database', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: 999 });
    mPrisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer valid_token_no_user');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token. User not found.');
  });

  // Test 4: Authorization failure (Not an ADMIN)
  it('4. Should return 403 if the user is authenticated but not an ADMIN', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validNormalUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validNormalUser);

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer user_token');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied. Admin privileges required.');
  });

  // Test 5: Success case
  it('5. Should return 200 and analytics data if user is a valid ADMIN', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validAdminUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validAdminUser);
    adminService.getAnalyticsData.mockResolvedValue(mockAnalyticsData);

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  // Test 6: Controller/Service integration
  it('6. Should call adminService.getAnalyticsData exactly once for valid request', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validAdminUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validAdminUser);
    adminService.getAnalyticsData.mockResolvedValue(mockAnalyticsData);

    await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer admin_token');

    expect(adminService.getAnalyticsData).toHaveBeenCalledTimes(1);
  });

  // Test 7: Error handling
  it('7. Should return 500 if adminService.getAnalyticsData throws an error', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validAdminUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validAdminUser);
    adminService.getAnalyticsData.mockRejectedValue(new Error('Database connection failed'));

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to retrieve analytics data');
  });

  // Test 8: Verify Summary data structure
  it('8. Should contain correct summary metrics structure in the success response', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validAdminUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validAdminUser);
    adminService.getAnalyticsData.mockResolvedValue(mockAnalyticsData);

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer admin_token');

    expect(response.body.data.summary).toBeDefined();
    expect(response.body.data.summary.totalUsers).toBe(10);
    expect(response.body.data.summary.publicTrips).toBe(2);
  });

  // Test 9: Verify Arrays structure
  it('9. Should contain popularCities and popularActivities in the success response', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validAdminUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validAdminUser);
    adminService.getAnalyticsData.mockResolvedValue(mockAnalyticsData);

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer admin_token');

    expect(Array.isArray(response.body.data.popularCities)).toBe(true);
    expect(Array.isArray(response.body.data.popularActivities)).toBe(true);
    expect(response.body.data.popularCities.length).toBeGreaterThan(0);
  });

  // Test 10: Graceful handling of empty DB states
  it('10. Should handle an empty database scenario gracefully with empty arrays and zeros', async () => {
    jwtUtils.verifyToken.mockReturnValue({ id: validAdminUser.id });
    mPrisma.user.findUnique.mockResolvedValue(validAdminUser);
    adminService.getAnalyticsData.mockResolvedValue(emptyAnalyticsData);

    const response = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', 'Bearer admin_token');

    expect(response.status).toBe(200);
    expect(response.body.data.summary.totalUsers).toBe(0);
    expect(response.body.data.recentTrips).toHaveLength(0);
  });

});

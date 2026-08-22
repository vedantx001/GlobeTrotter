import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing the modules that depend on them
jest.unstable_mockModule('../services/user.service.js', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  getSavedDestinations: jest.fn(),
  toggleSavedDestination: jest.fn(),
  deleteAccount: jest.fn(),
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
const userService = await import('../services/user.service.js');
const jwtUtils = await import('../utils/jwt.js');
const userRoutes = (await import('../routes/user.routes.js')).default;

// 3. Setup test express app
const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

// Mock Data
const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  city: 'New York',
  country: 'USA',
  role: 'USER'
};

const mockToken = 'mocked.jwt.token';

describe('User API Tests', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    // Default auth mock setup for authenticated routes
    jwtUtils.verifyToken.mockReturnValue({ id: mockUser.id });
    mPrismaClient.user.findUnique.mockResolvedValue(mockUser);
  });

  describe('GET /api/user/profile', () => {
    // Test 1: Fetch Profile Successfully
    it('1. should fetch profile successfully', async () => {
      userService.getProfile.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
    });

    // Test 2: User Not Found
    it('2. should return 404 if user not found in service', async () => {
      userService.getProfile.mockRejectedValue(new Error('User not found'));
      
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    // Test 3: Unauthorized access
    it('3. should return 401 if token is missing', async () => {
      const response = await request(app).get('/api/user/profile');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('PUT /api/user/profile', () => {
    // Test 4: Update Profile Successfully
    it('4. should update profile successfully', async () => {
      userService.updateProfile.mockResolvedValue();
      
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ firstName: 'Jane', phone: '0987654321' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
    });

    // Test 5: Validation Failure (Empty First Name)
    it('5. should return 400 for empty first name', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ firstName: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('First name cannot be empty');
    });
  });

  describe('GET /api/user/saved-destinations', () => {
    // Test 6: Fetch Saved Destinations
    it('6. should fetch saved destinations successfully', async () => {
      const mockDestinations = [{ id: 1, name: 'Paris', country: 'France' }];
      userService.getSavedDestinations.mockResolvedValue(mockDestinations);
      
      const response = await request(app)
        .get('/api/user/saved-destinations')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDestinations);
    });
  });

  describe('POST /api/user/saved-destinations/:cityId', () => {
    // Test 7: Toggle Bookmark Successfully
    it('7. should toggle bookmark successfully', async () => {
      userService.toggleSavedDestination.mockResolvedValue('Destination saved');
      
      const response = await request(app)
        .post('/api/user/saved-destinations/100')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Destination saved');
    });

    // Test 8: Invalid City ID Validation
    it('8. should return 400 for invalid city id parameter', async () => {
      const response = await request(app)
        .post('/api/user/saved-destinations/invalid-id')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Valid City ID is required');
    });

    // Test 9: City Not Found in Database
    it('9. should return 404 if city not found', async () => {
      userService.toggleSavedDestination.mockRejectedValue(new Error('City not found'));
      
      const response = await request(app)
        .post('/api/user/saved-destinations/999')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('City not found');
    });
  });

  describe('DELETE /api/user/account', () => {
    // Test 10: Delete Account Successfully
    it('10. should delete account successfully', async () => {
      userService.deleteAccount.mockResolvedValue();
      
      const response = await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Account deleted successfully');
    });
  });
});

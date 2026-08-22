import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing modules
jest.unstable_mockModule('../services/share.service.js', () => ({
  shareTrip: jest.fn(),
  getPublicTrip: jest.fn(),
  forkTrip: jest.fn(),
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
const shareService = await import('../services/share.service.js');
const jwtUtils = await import('../utils/jwt.js');
const shareRoutes = (await import('../routes/share.routes.js')).default;

// 3. Setup test express app
const app = express();
app.use(express.json());
// Mount the share routes at /api/trips to match specifications
app.use('/api/trips', shareRoutes);

// Mock data
const mockUser = { id: 1, email: 'test@example.com' };
const mockToken = 'mocked.jwt.token';
const mockShareToken = 'randomhexstring123456';
const mockTripId = 1;
const mockNewTripId = 2;

const mockPublicTripData = {
  trip: { id: 1, title: 'Paris Trip', is_public: true },
  stops: [],
  activities: []
};

describe('Share API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default auth mocks for authenticated routes
    jwtUtils.verifyToken.mockReturnValue({ id: mockUser.id });
    mPrismaClient.user.findUnique.mockResolvedValue(mockUser);
  });

  describe('POST /api/trips/:tripId/share', () => {
    // Test 1: Successful sharing
    it('1. should generate a public sharing link successfully', async () => {
      shareService.shareTrip.mockResolvedValue(mockShareToken);

      const response = await request(app)
        .post(`/api/trips/${mockTripId}/share`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.shareToken).toBe(mockShareToken);
      expect(response.body.data.shareUrl).toBe(`/trips/share/${mockShareToken}`);
    });

    // Test 2: Validation failure
    it('2. should return 400 if tripId is invalid', async () => {
      const response = await request(app)
        .post('/api/trips/abc/share')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Valid tripId is required.');
    });

    // Test 3: Unauthorized sharing or trip not found
    it('3. should return 403 if trip not found or unauthorized access', async () => {
      shareService.shareTrip.mockRejectedValue(new Error('Trip not found or unauthorized access'));

      const response = await request(app)
        .post(`/api/trips/${mockTripId}/share`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trip not found or unauthorized access');
    });

    // Test 4: Auth middleware block
    it('4. should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .post(`/api/trips/${mockTripId}/share`); // No token

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/trips/public/:shareToken', () => {
    // Test 5: Successful data retrieval
    it('5. should fetch complete public trip data successfully', async () => {
      shareService.getPublicTrip.mockResolvedValue(mockPublicTripData);

      const response = await request(app)
        .get(`/api/trips/public/${mockShareToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPublicTripData);
    });

    // Test 6: Validation failure
    it('6. should return 400 if shareToken is missing or invalid', async () => {
      const response = await request(app)
        .get('/api/trips/public/ '); // whitespace token

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Valid shareToken is required.');
    });

    // Test 7: Not found
    it('7. should return 404 if public trip is not found', async () => {
      shareService.getPublicTrip.mockRejectedValue(new Error('Public trip not found'));

      const response = await request(app)
        .get(`/api/trips/public/${mockShareToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Public trip not found');
    });
  });

  describe('POST /api/trips/fork/:shareToken', () => {
    // Test 8: Successful fork
    it('8. should clone a public trip successfully', async () => {
      shareService.forkTrip.mockResolvedValue(mockNewTripId);

      const response = await request(app)
        .post(`/api/trips/fork/${mockShareToken}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Trip copied successfully');
      expect(response.body.data.tripId).toBe(mockNewTripId);
    });

    // Test 9: Not found or not public
    it('9. should return 404 if public trip is not found when forking', async () => {
      shareService.forkTrip.mockRejectedValue(new Error('Public trip not found'));

      const response = await request(app)
        .post(`/api/trips/fork/${mockShareToken}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Public trip not found');
    });

    // Test 10: Auth middleware block
    it('10. should return 401 if user is not authenticated when forking', async () => {
      const response = await request(app)
        .post(`/api/trips/fork/${mockShareToken}`); // No token

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

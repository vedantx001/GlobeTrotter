import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing dependent modules
jest.unstable_mockModule('../services/trip.service.js', () => ({
  getUserTrips: jest.fn(),
  createTrip: jest.fn(),
  getTripById: jest.fn(),
  updateTrip: jest.fn(),
  deleteTrip: jest.fn(),
}));

jest.unstable_mockModule('../utils/jwt.js', () => ({
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
}));

const mPrismaClient = {
  user: {
    findUnique: jest.fn(),
  },
};

jest.unstable_mockModule('../config/prisma.js', () => ({
  default: mPrismaClient,
}));

// 2. Import modules dynamically after mocking
const tripService = await import('../services/trip.service.js');
const jwtUtils = await import('../utils/jwt.js');
const tripRoutes = (await import('../routes/trip.routes.js')).default;

// 3. Setup test express app
const app = express();
app.use(express.json());
app.use('/api/trips', tripRoutes);

// Mock Users & Tokens
const mockUser1 = {
  id: 1,
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@globetrotter.local',
  role: 'USER',
};

const mockUser2 = {
  id: 2,
  firstName: 'Sarah',
  lastName: 'Connor',
  email: 'sarah@globetrotter.local',
  role: 'USER',
};

const tokenUser1 = 'token.for.user1';
const tokenUser2 = 'token.for.user2';

const mockTrip1 = {
  id: 101,
  userId: 1,
  title: 'European Grand Tour 2026',
  description: 'Exploring London, Paris, and Amsterdam.',
  startDate: '2026-09-10T00:00:00.000Z',
  endDate: '2026-09-24T00:00:00.000Z',
  coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  totalBudget: '3500.00',
  isPublic: true,
  shareToken: 'eu-grand-tour-2026',
  destinationCount: 3,
  destination_count: 3,
  tripStops: [],
};

describe('Trip CRUD API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default auth mock setup
    jwtUtils.verifyToken.mockImplementation((token) => {
      if (token === tokenUser1) return { id: mockUser1.id };
      if (token === tokenUser2) return { id: mockUser2.id };
      throw new Error('invalid token');
    });

    mPrismaClient.user.findUnique.mockImplementation(({ where }) => {
      if (where.id === mockUser1.id) return Promise.resolve(mockUser1);
      if (where.id === mockUser2.id) return Promise.resolve(mockUser2);
      return Promise.resolve(null);
    });
  });

  describe('GET /api/trips (List Trips)', () => {
    it('1. should return 200 and only the authenticated user trips with destinationCount', async () => {
      tripService.getUserTrips.mockResolvedValue([mockTrip1]);

      const response = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trips).toHaveLength(1);
      expect(response.body.data.trips[0].id).toBe(101);
      expect(response.body.data.trips[0].destinationCount).toBe(3);
      expect(tripService.getUserTrips).toHaveBeenCalledWith(1);
    });

    it('2. should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/api/trips');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('POST /api/trips (Create Trip)', () => {
    it('3. should create a trip successfully and return 201', async () => {
      const newTripData = {
        title: 'Alpine Exploration',
        description: 'Hiking through Switzerland.',
        startDate: '2026-10-01',
        endDate: '2026-10-10',
        totalBudget: 2500.0,
      };

      const createdTrip = {
        id: 102,
        userId: 1,
        ...newTripData,
        destinationCount: 0,
      };

      tripService.createTrip.mockResolvedValue(createdTrip);

      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send(newTripData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trip.id).toBe(102);
      expect(tripService.createTrip).toHaveBeenCalledWith(1, expect.objectContaining(newTripData));
    });

    it('4. should return 400 if title is missing or empty', async () => {
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ title: '   ', startDate: '2026-10-01' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Trip title is required');
    });

    it('5. should return 400 if end date is before start date', async () => {
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          title: 'Invalid Date Trip',
          startDate: '2026-10-10',
          endDate: '2026-10-01',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('End date must be greater than or equal to start date');
    });

    it('6. should return 400 if totalBudget is negative', async () => {
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          title: 'Negative Budget Trip',
          totalBudget: -500,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Total budget must be a non-negative number');
    });
  });

  describe('GET /api/trips/:id (Get Single Trip)', () => {
    it('7. should return 200 and trip details for owner', async () => {
      tripService.getTripById.mockResolvedValue(mockTrip1);

      const response = await request(app)
        .get('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trip.id).toBe(101);
      expect(tripService.getTripById).toHaveBeenCalledWith(1, '101');
    });

    it('8. should return 404 if user attempts to access another user trip', async () => {
      // User 2 trying to access User 1's trip 101
      tripService.getTripById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser2}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trip not found.');
      expect(tripService.getTripById).toHaveBeenCalledWith(2, '101');
    });
  });

  describe('PUT /api/trips/:id (Update Trip)', () => {
    it('9. should update trip metadata and return 200 for owner', async () => {
      const updatedTrip = { ...mockTrip1, title: 'Updated European Grand Tour' };
      tripService.updateTrip.mockResolvedValue(updatedTrip);

      const response = await request(app)
        .put('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ title: 'Updated European Grand Tour' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trip.title).toBe('Updated European Grand Tour');
      expect(tripService.updateTrip).toHaveBeenCalledWith(1, '101', expect.objectContaining({ title: 'Updated European Grand Tour' }));
    });

    it('10. should return 404 when updating another user trip', async () => {
      tripService.updateTrip.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send({ title: 'Hacked Title' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trip not found.');
    });

    it('11. should return 400 if updated title is empty', async () => {
      const response = await request(app)
        .put('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Trip title cannot be empty');
    });
  });

  describe('DELETE /api/trips/:id (Delete Trip)', () => {
    it('12. should delete trip and return 200 for owner', async () => {
      tripService.deleteTrip.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Trip deleted successfully.');
      expect(tripService.deleteTrip).toHaveBeenCalledWith(1, '101');
    });

    it('13. should return 404 when deleting another user trip', async () => {
      tripService.deleteTrip.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/trips/101')
        .set('Authorization', `Bearer ${tokenUser2}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trip not found.');
      expect(tripService.deleteTrip).toHaveBeenCalledWith(2, '101');
    });
  });
});

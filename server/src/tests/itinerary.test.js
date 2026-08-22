import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing modules
jest.unstable_mockModule('../services/itinerary.service.js', () => ({
  getItinerary: jest.fn(),
  createStop: jest.fn(),
  updateStop: jest.fn(),
  deleteStop: jest.fn(),
  reorderStops: jest.fn(),
  assignActivity: jest.fn(),
  deleteItineraryActivity: jest.fn(),
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
const itineraryService = await import('../services/itinerary.service.js');
const jwtUtils = await import('../utils/jwt.js');
const itineraryRoutes = (await import('../routes/itinerary.routes.js')).default;

// 3. Setup test express app
const app = express();
app.use(express.json());
app.use('/api/trips', itineraryRoutes);

// Mock data
const mockUser1 = { id: 1, email: 'alex@globetrotter.local', role: 'USER' };
const mockUser2 = { id: 2, email: 'sarah@globetrotter.local', role: 'USER' };
const tokenUser1 = 'token.for.user1';
const tokenUser2 = 'token.for.user2';

const mockItinerary = {
  id: 1,
  userId: 1,
  title: 'European Grand Tour 2026',
  description: 'Grand journey through Europe',
  startDate: '2026-09-10T00:00:00.000Z',
  endDate: '2026-09-24T00:00:00.000Z',
  coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  totalBudget: '3500.00',
  tripStops: [
    {
      id: 10,
      tripId: 1,
      cityId: 1,
      stopOrder: 0,
      startDate: '2026-09-10T00:00:00.000Z',
      endDate: '2026-09-14T00:00:00.000Z',
      notes: 'Paris Stop',
      city: {
        id: 1,
        name: 'Paris',
        country: 'France',
        region: 'Europe',
      },
      itineraryActivities: [
        {
          id: 100,
          tripStopId: 10,
          activityId: 1,
          scheduledDate: '2026-09-11T00:00:00.000Z',
          timeSlot: 'Morning',
          customCost: '25.00',
          notes: 'Louvre early admission',
          activity: {
            id: 1,
            cityId: 1,
            title: 'Louvre Museum Tour',
            cost: '22.00',
          },
        },
      ],
    },
  ],
};

const mockCreatedStop = {
  id: 11,
  tripId: 1,
  cityId: 2,
  stopOrder: 1,
  startDate: '2026-09-15T00:00:00.000Z',
  endDate: '2026-09-18T00:00:00.000Z',
  notes: 'Amsterdam Stop',
  city: { id: 2, name: 'Amsterdam', country: 'Netherlands' },
  itineraryActivities: [],
};

describe('Itinerary API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

  describe('GET /api/trips/:tripId/itinerary', () => {
    it('1. should return complete itinerary for the trip owner', async () => {
      itineraryService.getItinerary.mockResolvedValue(mockItinerary);

      const response = await request(app)
        .get('/api/trips/1/itinerary')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.itinerary.id).toBe(1);
      expect(response.body.data.itinerary.tripStops).toHaveLength(1);
      expect(response.body.data.itinerary.tripStops[0].itineraryActivities).toHaveLength(1);
      expect(itineraryService.getItinerary).toHaveBeenCalledWith(1, '1');
    });

    it('2. should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/api/trips/1/itinerary');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('3. should return 404 for nonexistent or unauthorized trip', async () => {
      itineraryService.getItinerary.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/trips/999/itinerary')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Trip not found.');
    });
  });

  describe('POST /api/trips/:tripId/stops', () => {
    it('4. should create a stop successfully and return 201', async () => {
      itineraryService.createStop.mockResolvedValue(mockCreatedStop);

      const response = await request(app)
        .post('/api/trips/1/stops')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          cityId: 2,
          startDate: '2026-09-15',
          endDate: '2026-09-18',
          notes: 'Amsterdam Stop',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stop.id).toBe(11);
      expect(itineraryService.createStop).toHaveBeenCalledWith(
        1,
        '1',
        expect.objectContaining({ cityId: 2 })
      );
    });

    it('5. should return 400 if cityId is missing or invalid', async () => {
      const response = await request(app)
        .post('/api/trips/1/stops')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ startDate: '2026-09-15' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('cityId is required');
    });

    it('6. should return 400 if end date is before start date', async () => {
      const response = await request(app)
        .post('/api/trips/1/stops')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          cityId: 2,
          startDate: '2026-09-18',
          endDate: '2026-09-15',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('End date must be greater than or equal to start date');
    });

    it('7. should return 400 if stop date is outside parent trip range', async () => {
      const err = new Error('Stop start date cannot be before trip start date.');
      err.statusCode = 400;
      itineraryService.createStop.mockRejectedValue(err);

      const response = await request(app)
        .post('/api/trips/1/stops')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          cityId: 2,
          startDate: '2026-08-01',
          endDate: '2026-08-05',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Stop start date cannot be before trip start date');
    });
  });

  describe('PUT /api/trips/:tripId/stops/:stopId', () => {
    it('8. should update a stop and return 200', async () => {
      const updatedStop = { ...mockCreatedStop, notes: 'Updated notes' };
      itineraryService.updateStop.mockResolvedValue(updatedStop);

      const response = await request(app)
        .put('/api/trips/1/stops/11')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ notes: 'Updated notes' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stop.notes).toBe('Updated notes');
      expect(itineraryService.updateStop).toHaveBeenCalledWith(
        1,
        '1',
        '11',
        expect.objectContaining({ notes: 'Updated notes' })
      );
    });

    it('9. should return 404 when updating a stop on unauthorized trip', async () => {
      const err = new Error('Trip not found.');
      err.statusCode = 404;
      itineraryService.updateStop.mockRejectedValue(err);

      const response = await request(app)
        .put('/api/trips/1/stops/11')
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send({ notes: 'Hacked' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/trips/:tripId/stops/:stopId', () => {
    it('10. should delete a stop and return 200', async () => {
      itineraryService.deleteStop.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/trips/1/stops/11')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Trip stop deleted successfully.');
      expect(itineraryService.deleteStop).toHaveBeenCalledWith(1, '1', '11');
    });

    it('11. should return 404 when deleting nonexistent stop', async () => {
      const err = new Error('Trip stop not found.');
      err.statusCode = 404;
      itineraryService.deleteStop.mockRejectedValue(err);

      const response = await request(app)
        .delete('/api/trips/1/stops/999')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/trips/:tripId/stops/reorder', () => {
    it('12. should reorder stops atomically and return 200', async () => {
      const reorderedStops = [
        { ...mockCreatedStop, stopOrder: 0 },
        { ...mockItinerary.tripStops[0], stopOrder: 1 },
      ];
      itineraryService.reorderStops.mockResolvedValue(reorderedStops);

      const payload = {
        stops: [
          { stopId: 11, order: 0 },
          { stopId: 10, order: 1 },
        ],
      };

      const response = await request(app)
        .put('/api/trips/1/stops/reorder')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stops).toHaveLength(2);
      expect(itineraryService.reorderStops).toHaveBeenCalledWith(1, '1', payload.stops);
    });

    it('13. should return 400 for duplicate stopIds in reorder payload', async () => {
      const payload = {
        stops: [
          { stopId: 11, order: 0 },
          { stopId: 11, order: 1 },
        ],
      };

      const response = await request(app)
        .put('/api/trips/1/stops/reorder')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Duplicate stopId');
    });

    it('14. should return 400 for duplicate order numbers in reorder payload', async () => {
      const payload = {
        stops: [
          { stopId: 11, order: 0 },
          { stopId: 10, order: 0 },
        ],
      };

      const response = await request(app)
        .put('/api/trips/1/stops/reorder')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Duplicate order value');
    });
  });

  describe('POST /api/trips/stops/:stopId/activities', () => {
    it('15. should assign an activity to a stop and return 201', async () => {
      const createdActivity = mockItinerary.tripStops[0].itineraryActivities[0];
      itineraryService.assignActivity.mockResolvedValue(createdActivity);

      const response = await request(app)
        .post('/api/trips/stops/10/activities')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          activityId: 1,
          scheduledDate: '2026-09-11',
          timeSlot: 'Morning',
          customCost: 25,
          notes: 'Louvre early admission',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.itineraryActivity.id).toBe(100);
      expect(itineraryService.assignActivity).toHaveBeenCalledWith(
        1,
        '10',
        expect.objectContaining({ activityId: 1 })
      );
    });

    it('16. should return 400 if activity is from a different city', async () => {
      const err = new Error('Activity must belong to the same city as the trip stop.');
      err.statusCode = 400;
      itineraryService.assignActivity.mockRejectedValue(err);

      const response = await request(app)
        .post('/api/trips/stops/10/activities')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          activityId: 99, // Tokyo activity on Paris stop
          scheduledDate: '2026-09-11',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Activity must belong to the same city as the trip stop.');
    });

    it('17. should return 400 if timeSlot is invalid', async () => {
      const response = await request(app)
        .post('/api/trips/stops/10/activities')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          activityId: 1,
          timeSlot: 'Midnight',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid timeSlot');
    });

    it('18. should return 400 if customCost is negative', async () => {
      const response = await request(app)
        .post('/api/trips/stops/10/activities')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          activityId: 1,
          customCost: -10,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('customCost must be a non-negative number');
    });
  });

  describe('DELETE /api/trips/activities/:itineraryActivityId', () => {
    it('19. should delete assigned activity and return 200', async () => {
      itineraryService.deleteItineraryActivity.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/trips/activities/100')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Itinerary activity removed successfully.');
      expect(itineraryService.deleteItineraryActivity).toHaveBeenCalledWith(1, '100');
    });

    it('20. should return 404 when deleting another user assigned activity', async () => {
      const err = new Error('Itinerary activity not found.');
      err.statusCode = 404;
      itineraryService.deleteItineraryActivity.mockRejectedValue(err);

      const response = await request(app)
        .delete('/api/trips/activities/100')
        .set('Authorization', `Bearer ${tokenUser2}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});

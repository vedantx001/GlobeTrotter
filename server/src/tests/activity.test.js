import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing modules
jest.unstable_mockModule('../services/activity.service.js', () => ({
  searchActivities: jest.fn(),
}));

// 2. Import modules dynamically after mocking
const activityService = await import('../services/activity.service.js');
const activityRoutes = (await import('../routes/activity.routes.js')).default;

// 3. Setup test express app
const app = express();
app.use(express.json());
app.use('/api/activities', activityRoutes);

// Mock data
const mockActivities = [
  {
    id: 1,
    cityId: 1,
    title: 'Louvre Museum Tour',
    description: 'Explore world-famous art collections including Mona Lisa.',
    category: 'Culture',
    cost: '22.00',
    durationHours: '3.00',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    city: { id: 1, name: 'Paris', country: 'France' },
  },
  {
    id: 2,
    cityId: 1,
    title: 'Eiffel Tower Sunset Experience',
    description: 'Breathtaking panoramic views over Paris at twilight.',
    category: 'Sightseeing',
    cost: '35.00',
    durationHours: '2.50',
    imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800',
    city: { id: 1, name: 'Paris', country: 'France' },
  },
  {
    id: 3,
    cityId: 2,
    title: 'Shibuya Crossing & Izakaya Crawl',
    description: 'Experience Tokyo nightlife and delicious yakitori.',
    category: 'Food & Dining',
    cost: '50.00',
    durationHours: '4.00',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    city: { id: 2, name: 'Tokyo', country: 'Japan' },
  },
];

describe('Activity Search API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/activities (Public Discovery & Search)', () => {
    // Test 1: Get all activities publicly without JWT
    it('1. should fetch activities list with pagination publicly without JWT', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: mockActivities,
        pagination: {
          limit: 20,
          offset: 0,
          total: 3,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/activities');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Activities fetched successfully.');
      expect(response.body.data.activities).toHaveLength(3);
      expect(response.body.data.pagination).toEqual({
        limit: 20,
        offset: 0,
        total: 3,
        hasMore: false,
      });
      expect(activityService.searchActivities).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    // Test 2: Keyword search (q parameter)
    it('2. should search activities by keyword q (e.g. q=museum or q=MUSEUM)', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/activities?q=MUSEUM');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toHaveLength(1);
      expect(response.body.data.activities[0].title).toBe('Louvre Museum Tour');
      expect(activityService.searchActivities).toHaveBeenCalledWith(expect.objectContaining({ q: 'MUSEUM' }));
    });

    // Test 3: City filter
    it('3. should filter activities by cityId', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0], mockActivities[1]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 2,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/activities?cityId=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toHaveLength(2);
      expect(response.body.data.activities.every((a) => a.cityId === 1)).toBe(true);
      expect(activityService.searchActivities).toHaveBeenCalledWith(expect.objectContaining({ cityId: '1' }));
    });

    // Test 4: Category filter
    it('4. should filter by category and reject unsupported category with 400', async () => {
      // Valid category
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const validResponse = await request(app).get('/api/activities?category=Culture');
      expect(validResponse.status).toBe(200);
      expect(validResponse.body.success).toBe(true);
      expect(validResponse.body.data.activities[0].category).toBe('Culture');

      // Invalid category
      const invalidResponse = await request(app).get('/api/activities?category=UnrealCategory');
      expect(invalidResponse.status).toBe(400);
      expect(invalidResponse.body.success).toBe(false);
      expect(invalidResponse.body.message).toContain('Invalid category parameter');
    });

    // Test 5: Cost filtering
    it('5. should filter by minCost and maxCost, and reject minCost > maxCost or negative cost with 400', async () => {
      // Valid cost range
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0], mockActivities[1]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 2,
          hasMore: false,
        },
      });

      const validResponse = await request(app).get('/api/activities?minCost=20&maxCost=40');
      expect(validResponse.status).toBe(200);
      expect(validResponse.body.success).toBe(true);

      // minCost > maxCost
      const invalidRangeResponse = await request(app).get('/api/activities?minCost=100&maxCost=50');
      expect(invalidRangeResponse.status).toBe(400);
      expect(invalidRangeResponse.body.message).toContain('minCost cannot be greater than maxCost');

      // Negative minCost
      const negativeCostResponse = await request(app).get('/api/activities?minCost=-10');
      expect(negativeCostResponse.status).toBe(400);
      expect(negativeCostResponse.body.message).toContain('Invalid minCost');
    });

    // Test 6: Duration filtering
    it('6. should filter by minDuration and maxDuration, and reject minDuration > maxDuration with 400', async () => {
      // Valid duration range
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const validResponse = await request(app).get('/api/activities?minDuration=2&maxDuration=4');
      expect(validResponse.status).toBe(200);
      expect(validResponse.body.success).toBe(true);

      // minDuration > maxDuration
      const invalidRangeResponse = await request(app).get('/api/activities?minDuration=5&maxDuration=2');
      expect(invalidRangeResponse.status).toBe(400);
      expect(invalidRangeResponse.body.message).toContain('minDuration cannot be greater than maxDuration');
    });

    // Test 7: Combined filters
    it('7. should apply combined filters simultaneously (cityId + category + maxCost)', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/activities?cityId=1&category=Culture&maxCost=30');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toHaveLength(1);
      expect(activityService.searchActivities).toHaveBeenCalledWith(
        expect.objectContaining({ cityId: '1', category: 'Culture', maxCost: '30' })
      );
    });

    // Test 8: Pagination
    it('8. should support limit and offset pagination with hasMore metadata', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0], mockActivities[1]],
        pagination: {
          limit: 2,
          offset: 0,
          total: 3,
          hasMore: true,
        },
      });

      const response = await request(app).get('/api/activities?limit=2&offset=0');

      expect(response.status).toBe(200);
      expect(response.body.data.activities).toHaveLength(2);
      expect(response.body.data.pagination.hasMore).toBe(true);
      expect(activityService.searchActivities).toHaveBeenCalledWith(
        expect.objectContaining({ limit: '2', offset: '0' })
      );
    });

    // Test 9: Empty search results
    it('9. should return 200 with empty array if no activities match query', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: [],
        pagination: {
          limit: 20,
          offset: 0,
          total: 0,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/activities?q=nonexistentactivityxyz');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activities).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });

    // Test 10: Invalid limit / offset / cityId
    it('10. should return 400 for negative or invalid pagination and query parameters', async () => {
      // Invalid cityId
      const resCity = await request(app).get('/api/activities?cityId=abc');
      expect(resCity.status).toBe(400);
      expect(resCity.body.message).toContain('Invalid cityId');

      // Negative limit
      const resNegLimit = await request(app).get('/api/activities?limit=-5');
      expect(resNegLimit.status).toBe(400);
      expect(resNegLimit.body.message).toContain('Invalid limit');

      // Limit > 50
      const resExLimit = await request(app).get('/api/activities?limit=100');
      expect(resExLimit.status).toBe(400);
      expect(resExLimit.body.message).toContain('Invalid limit');

      // Negative offset
      const resNegOffset = await request(app).get('/api/activities?offset=-1');
      expect(resNegOffset.status).toBe(400);
      expect(resNegOffset.body.message).toContain('Invalid offset');
    });

    // Test 11: Response safety (public fields only)
    it('11. should return only expected public activity and city fields, no sensitive internal data', async () => {
      activityService.searchActivities.mockResolvedValue({
        activities: [mockActivities[0]],
        pagination: { limit: 20, offset: 0, total: 1, hasMore: false },
      });

      const response = await request(app).get('/api/activities');

      expect(response.status).toBe(200);
      const activity = response.body.data.activities[0];
      expect(activity).toHaveProperty('id');
      expect(activity).toHaveProperty('cityId');
      expect(activity).toHaveProperty('title');
      expect(activity).toHaveProperty('description');
      expect(activity).toHaveProperty('category');
      expect(activity).toHaveProperty('cost');
      expect(activity).toHaveProperty('durationHours');
      expect(activity).toHaveProperty('imageUrl');
      expect(activity).toHaveProperty('city');
      expect(activity.city).toHaveProperty('name');
      expect(activity).not.toHaveProperty('password');
      expect(activity).not.toHaveProperty('passwordHash');
    });
  });
});

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing modules
jest.unstable_mockModule('../services/city.service.js', () => ({
  searchCities: jest.fn(),
}));

// 2. Import modules dynamically after mocking
const cityService = await import('../services/city.service.js');
const cityRoutes = (await import('../routes/city.routes.js')).default;

// 3. Setup test express app
const app = express();
app.use(express.json());
app.use('/api/cities', cityRoutes);

// Mock data
const mockCities = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: '3.50',
    popularityScore: 98.5,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light.',
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: '4.00',
    popularityScore: 97.0,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    description: 'A vibrant metropolis.',
  },
  {
    id: 3,
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    costIndex: '3.00',
    popularityScore: 91.0,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    description: 'Ancient temples and shrines.',
  },
  {
    id: 4,
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: '3.00',
    popularityScore: 94.0,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    description: 'The Eternal City.',
  },
];

describe('City Search API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cities (Public Discovery & Search)', () => {
    // Test 1: Get all cities without authentication
    it('1. should fetch cities list with pagination publicly without JWT', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: mockCities,
        pagination: {
          limit: 20,
          offset: 0,
          total: 4,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/cities');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cities fetched successfully.');
      expect(response.body.data.cities).toHaveLength(4);
      expect(response.body.data.pagination).toEqual({
        limit: 20,
        offset: 0,
        total: 4,
        hasMore: false,
      });
      expect(cityService.searchCities).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    // Test 2: Keyword search (case-insensitive)
    it('2. should search cities by keyword q (e.g. q=paris or q=PARIS)', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[0]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/cities?q=PARIS');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cities).toHaveLength(1);
      expect(response.body.data.cities[0].name).toBe('Paris');
      expect(cityService.searchCities).toHaveBeenCalledWith(expect.objectContaining({ q: 'PARIS' }));
    });

    // Test 3: Country filter
    it('3. should filter cities by country', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[0]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/cities?country=France');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cities).toHaveLength(1);
      expect(response.body.data.cities[0].country).toBe('France');
      expect(cityService.searchCities).toHaveBeenCalledWith(expect.objectContaining({ country: 'France' }));
    });

    // Test 4: Region filter
    it('4. should filter cities by region', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[0], mockCities[3]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 2,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/cities?region=Europe');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cities).toHaveLength(2);
      expect(response.body.data.cities.every((c) => c.region === 'Europe')).toBe(true);
      expect(cityService.searchCities).toHaveBeenCalledWith(expect.objectContaining({ region: 'Europe' }));
    });

    // Test 5: Combined filters
    it('5. should apply combined filters simultaneously (q + country + region)', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[1]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/cities?q=to&country=Japan&region=Asia');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cities).toHaveLength(1);
      expect(response.body.data.cities[0].name).toBe('Tokyo');
      expect(cityService.searchCities).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'to', country: 'Japan', region: 'Asia' })
      );
    });

    // Test 6: Cost filter
    it('6. should filter by costIndex and reject invalid costIndex with 400', async () => {
      // Valid numeric cost
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[2], mockCities[3]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 2,
          hasMore: false,
        },
      });

      const validResponse = await request(app).get('/api/cities?costIndex=3');
      expect(validResponse.status).toBe(200);
      expect(validResponse.body.success).toBe(true);

      // Invalid costIndex
      const invalidResponse = await request(app).get('/api/cities?costIndex=invalid');
      expect(invalidResponse.status).toBe(400);
      expect(invalidResponse.body.success).toBe(false);
      expect(invalidResponse.body.message).toContain('Invalid costIndex');
    });

    // Test 7: Popularity filter
    it('7. should filter by minPopularity and reject invalid minPopularity with 400', async () => {
      // Valid minPopularity
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[0], mockCities[1]],
        pagination: {
          limit: 20,
          offset: 0,
          total: 2,
          hasMore: false,
        },
      });

      const validResponse = await request(app).get('/api/cities?minPopularity=95');
      expect(validResponse.status).toBe(200);
      expect(validResponse.body.success).toBe(true);

      // Invalid minPopularity
      const invalidResponse = await request(app).get('/api/cities?minPopularity=abc');
      expect(invalidResponse.status).toBe(400);
      expect(invalidResponse.body.success).toBe(false);
      expect(invalidResponse.body.message).toContain('Invalid minPopularity');
    });

    // Test 8: Pagination
    it('8. should support limit and offset pagination with hasMore indicator', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[0], mockCities[1]],
        pagination: {
          limit: 2,
          offset: 0,
          total: 4,
          hasMore: true,
        },
      });

      const response = await request(app).get('/api/cities?limit=2&offset=0');

      expect(response.status).toBe(200);
      expect(response.body.data.cities).toHaveLength(2);
      expect(response.body.data.pagination.hasMore).toBe(true);
      expect(cityService.searchCities).toHaveBeenCalledWith(
        expect.objectContaining({ limit: '2', offset: '0' })
      );
    });

    // Test 9: Empty search results
    it('9. should return 200 with empty array if no cities match query', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [],
        pagination: {
          limit: 20,
          offset: 0,
          total: 0,
          hasMore: false,
        },
      });

      const response = await request(app).get('/api/cities?q=nonexistentcityxyz');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cities).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });

    // Test 10: Invalid limit or offset
    it('10. should return 400 for negative or out-of-range pagination parameters', async () => {
      // Negative limit
      const resNegLimit = await request(app).get('/api/cities?limit=-5');
      expect(resNegLimit.status).toBe(400);
      expect(resNegLimit.body.message).toContain('Invalid limit');

      // Excessive limit (> 50)
      const resExLimit = await request(app).get('/api/cities?limit=100');
      expect(resExLimit.status).toBe(400);
      expect(resExLimit.body.message).toContain('Invalid limit');

      // Negative offset
      const resNegOffset = await request(app).get('/api/cities?offset=-1');
      expect(resNegOffset.status).toBe(400);
      expect(resNegOffset.body.message).toContain('Invalid offset');
    });

    // Test 11: Response safety (public fields only)
    it('11. should return only expected public city metadata and no sensitive internal fields', async () => {
      cityService.searchCities.mockResolvedValue({
        cities: [mockCities[0]],
        pagination: { limit: 20, offset: 0, total: 1, hasMore: false },
      });

      const response = await request(app).get('/api/cities');

      expect(response.status).toBe(200);
      const city = response.body.data.cities[0];
      expect(city).toHaveProperty('id');
      expect(city).toHaveProperty('name');
      expect(city).toHaveProperty('country');
      expect(city).toHaveProperty('region');
      expect(city).toHaveProperty('costIndex');
      expect(city).toHaveProperty('popularityScore');
      expect(city).toHaveProperty('imageUrl');
      expect(city).toHaveProperty('description');
      expect(city).not.toHaveProperty('password');
      expect(city).not.toHaveProperty('passwordHash');
    });
  });
});

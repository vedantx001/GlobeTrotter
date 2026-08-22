import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// 1. Setup mocks before importing the modules that depend on them
jest.unstable_mockModule('../services/auth.service.js', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

jest.unstable_mockModule('../utils/jwt.js', () => ({
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
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
const authService = await import('../services/auth.service.js');
const jwtUtils = await import('../utils/jwt.js');
const authRoutes = (await import('../routes/auth.routes.js')).default;

// 3. Setup test express app to test the isolated router
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock data for our tests
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

const validRegisterData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  password: 'password123',
  city: 'New York',
  country: 'USA'
};

const mockToken = 'mocked.jwt.token';

describe('Authentication API Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test to prevent side effects
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    // Test 1: Successful Registration
    it('1. should register a new user successfully', async () => {
      authService.registerUser.mockResolvedValue({ user: mockUser, token: mockToken });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual(mockUser);
      expect(response.body.data.token).toBe(mockToken);
    });

    // Test 2: Validation Failure
    it('2. should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' }); // Missing other fields

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All required fields must be provided.');
    });

    // Test 3: Service Error (e.g., User already exists)
    it('3. should return 400 if user already exists', async () => {
      authService.registerUser.mockRejectedValue(new Error('User with this email or phone already exists.'));
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email or phone already exists.');
    });
  });

  describe('POST /api/auth/login', () => {
    // Test 4: Successful Login
    it('4. should login successfully with valid credentials', async () => {
      authService.loginUser.mockResolvedValue({ user: mockUser, token: mockToken });
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'john@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual(mockUser);
      expect(response.body.data.token).toBe(mockToken);
    });

    // Test 5: Validation Failure
    it('5. should return 400 if identifier or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'john@example.com' }); // Missing password

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Identifier and password are required.');
    });

    // Test 6: Invalid Credentials
    it('6. should return 401 for invalid credentials', async () => {
      authService.loginUser.mockRejectedValue(new Error('Invalid credentials.'));
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'john@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials.');
    });
  });

  describe('GET /api/auth/me', () => {
    // Test 7: Successful Profile Fetch
    it('7. should return user profile if token is valid', async () => {
      jwtUtils.verifyToken.mockReturnValue({ id: mockUser.id });
      mPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual(mockUser);
    });

    // Test 8: No Token Provided
    it('8. should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    // Test 9: Invalid Token Format
    it('9. should return 401 if token format is invalid (not Bearer)', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Token ${mockToken}`); // Not starting with 'Bearer '

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    // Test 10: Invalid/Expired Token or User Not Found
    it('10. should return 401 if token is invalid or expired', async () => {
      jwtUtils.verifyToken.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer invalid.token.here`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired token.');
    });
  });
});

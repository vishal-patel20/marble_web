import request from 'supertest';
import { app } from '../../src/app.js';

/**
 * Integration test suite for Auth endpoints
 * Tests: POST /api/v1/auth/register, POST /api/v1/auth/login, GET /api/v1/auth/me
 *
 * NOTE: These tests require a running PostgreSQL instance.
 * For CI/CD, ensure a test DB is configured via TEST_DB environment variables.
 */
describe('Auth Routes', () => {
  const testUser = {
    name: 'Test Architect',
    email: `testuser_${Date.now()}@marble.com`,
    password: 'SecurePass99',
  };

  let accessToken = null;

  // ===========================================================
  // 1. Health Check
  // ===========================================================
  describe('GET /health', () => {
    it('should return 200 with healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  // ===========================================================
  // 2. Disabled Public Registration
  // ===========================================================
  describe('POST /api/v1/auth/register', () => {
    it('should return 404 since public registration API is disabled', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(404);
    });
  });

  // ===========================================================
  // 3. Login
  // ===========================================================
  describe('POST /api/v1/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');

      accessToken = res.body.data.accessToken;
    });

    it('should fail with 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'WrongPassword1' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'ghost@nowhere.com', password: 'SomePass1' });

      expect(res.statusCode).toBe(401);
    });
  });

  // ===========================================================
  // 4. Protected Route - Get Me
  // ===========================================================
  describe('GET /api/v1/auth/me', () => {
    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.statusCode).toBe(401);
    });
  });
});

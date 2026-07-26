import request from 'supertest';
import { app } from '../../src/app.js';

/**
 * Integration test suite for Product & Category endpoints
 * Tests: GET /api/v1/inventory/categories, GET /api/v1/inventory/products
 */
describe('Inventory Routes', () => {
  let adminToken = null;

  // Setup: login as admin to get token for protected routes
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: process.env.ADMIN_TEST_EMAIL || 'admin@premiummarbles.com',
        password: process.env.ADMIN_TEST_PASSWORD || 'SecureAdmin99',
      });

    if (res.statusCode === 200) {
      adminToken = res.body.data?.accessToken;
    }
  });

  // ===========================================================
  // Categories
  // ===========================================================
  describe('Category Routes', () => {
    describe('GET /api/v1/inventory/categories', () => {
      it('should return an array of categories', async () => {
        const res = await request(app).get('/api/v1/inventory/categories');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it('should return category objects with required fields', async () => {
        const res = await request(app).get('/api/v1/inventory/categories');
        if (res.body.data.length > 0) {
          const cat = res.body.data[0];
          expect(cat).toHaveProperty('id');
          expect(cat).toHaveProperty('name');
          expect(cat).toHaveProperty('slug');
        }
      });
    });

    describe('POST /api/v1/inventory/categories', () => {
      it('should return 401 without admin authentication', async () => {
        const res = await request(app)
          .post('/api/v1/inventory/categories')
          .send({ name: 'Unauthorized Test Category' });

        expect(res.statusCode).toBe(401);
      });
    });
  });

  // ===========================================================
  // Products
  // ===========================================================
  describe('Product Routes', () => {
    describe('GET /api/v1/inventory/products', () => {
      it('should return paginated product list', async () => {
        const res = await request(app).get('/api/v1/inventory/products');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it('should support search query', async () => {
        const res = await request(app)
          .get('/api/v1/inventory/products')
          .query({ search: 'Calacatta' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });

      it('should support featured filter', async () => {
        const res = await request(app)
          .get('/api/v1/inventory/products')
          .query({ featured: 'true' });

        expect(res.statusCode).toBe(200);
        if (res.body.data.length > 0) {
          res.body.data.forEach((p) => {
            expect(p.featured).toBe(true);
          });
        }
      });

      it('should support pagination', async () => {
        const res = await request(app)
          .get('/api/v1/inventory/products')
          .query({ page: 1, limit: 3 });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(3);
      });
    });

    describe('POST /api/v1/inventory/products', () => {
      it('should return 401 without admin authentication', async () => {
        const res = await request(app)
          .post('/api/v1/inventory/products')
          .send({ name: 'Unauthorized Product' });

        expect(res.statusCode).toBe(401);
      });
    });

    describe('GET /api/v1/inventory/products/:slug', () => {
      it('should return 404 for non-existent slug', async () => {
        const res = await request(app)
          .get('/api/v1/inventory/products/nonexistent-slug-xyz-999');

        expect(res.statusCode).toBe(404);
      });
    });
  });
});

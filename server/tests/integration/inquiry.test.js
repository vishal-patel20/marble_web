import request from 'supertest';
import { app } from '../../src/app.js';
import Inquiry from '../../src/models/inquiry.model.js';

describe('Inquiry Endpoints', () => {
  beforeAll(async () => {
    await Inquiry.sync({ alter: true }).catch(() => {});
  }, 30000);

  it('should successfully submit an inquiry from public endpoint', async () => {
    const testInquiry = {
      name: 'Verification User',
      email: 'verifier@example.com',
      phone: '+1 555 123 4567',
      subject: 'Quote Inquiry Test',
      message: 'Testing inquiry submission flow.'
    };

    const res = await request(app)
      .post('/api/v1/leads/inquiries')
      .send(testInquiry);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(testInquiry.name);
    expect(res.body.data.email).toBe(testInquiry.email);
  }, 15000);

  it('should reject inquiry without name', async () => {
    const res = await request(app)
      .post('/api/v1/leads/inquiries')
      .send({ email: 'noname@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  }, 15000);

  it('should successfully submit an inquiry with an image URL', async () => {
    const testInquiry = {
      name: 'Product Inquirer',
      email: 'product_test@example.com',
      subject: 'Product Inquiry: Calacatta Gold',
      message: 'Interested in polished finish.',
      image: '/images/stone_image_10.jpg'
    };

    const res = await request(app)
      .post('/api/v1/leads/inquiries')
      .send(testInquiry);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.image).toContain('cloudinary.com');
    expect(res.body.data.image).toContain('inquiries');
  }, 15000);
});

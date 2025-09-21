import request from 'supertest';
import { app } from './setup.js';
import { Location } from '../models/Location.js';

describe('Location Routes', () => {
  beforeEach(async () => {
    await Location.create([
      {
        name: 'Test Location 1',
        description: 'A historical test location.',
        category: 'historical',
        images: ['https://example.com/image1.jpg'],
        coordinates: { type: 'Point', coordinates: [-74.0445, 40.6892] }
      },
      {
        name: 'Test Location 2',
        description: 'A natural test location.',
        category: 'natural',
        images: ['https://example.com/image2.jpg'],
        coordinates: { type: 'Point', coordinates: [-112.1401, 36.0544] }
      }
    ]);
  });

  describe('GET /api/locations', () => {
    it('should return all locations', async () => {
      const response = await request(app)
        .get('/api/locations')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.locations).toHaveLength(2);
    });

    it('should filter locations by category', async () => {
      const response = await request(app)
        .get('/api/locations?category=natural')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.locations).toHaveLength(1);
      expect(response.body.data.locations[0].category).toBe('natural');
    });
  });

  describe('GET /api/locations/:id', () => {
    it('should return a location by ID', async () => {
      const location = await Location.findOne({ name: 'Test Location 1' });
      const response = await request(app)
        .get(`/api/locations/${location!._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.location.name).toBe('Test Location 1');
    });
  });
});

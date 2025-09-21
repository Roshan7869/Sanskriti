import request from 'supertest';
import { app } from './setup.js';
import { Event } from '../models/Event.js';

describe('Event Routes', () => {
  beforeEach(async () => {
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14);

    // Create test events
    await Event.create([
      {
        name: 'Future Festival',
        description: 'A test festival event.',
        type: 'festival',
        startDate: futureDate1,
        images: ['https://example.com/image1.jpg'],
        coordinates: { type: 'Point', coordinates: [1, 1] }
      },
      {
        name: 'Future Celebration',
        description: 'A test celebration event.',
        type: 'celebration',
        startDate: futureDate2,
        images: ['https://example.com/image2.jpg'],
        coordinates: { type: 'Point', coordinates: [2, 2] }
      }
    ]);
  });

  describe('GET /api/events', () => {
    it('should return all events with pagination', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.totalItems).toBe(2);
    });

    it('should filter events by search query', async () => {
      const response = await request(app)
        .get('/api/events?query=Festival')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].name).toBe('Future Festival');
    });

    it('should filter events by category', async () => {
      const response = await request(app)
        .get('/api/events?type=festival')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].type).toBe('festival');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return event by ID', async () => {
      const event = await Event.findOne({ name: 'Future Festival' });
      
      const response = await request(app)
        .get(`/api/events/${event!._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.name).toBe(event!.name);
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/events/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Event not found');
    });
  });
});
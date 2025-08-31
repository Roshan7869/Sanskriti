import request from 'supertest';
import express from 'express';
import eventRoutes from '../routes/events.js';
import { Event } from '../models/Event.js';

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

describe('Event Routes', () => {
  beforeEach(async () => {
    // Create test events
    await Event.create([
      {
        title: 'Test Event 1',
        description: 'Test description 1',
        category: 'Cultural Event',
        location: 'Test Location 1',
        coordinates: { lat: 21.1925, lng: 81.3186 },
        date: new Date('2025-06-15T10:00:00Z'),
        imageUrl: 'https://example.com/image1.jpg'
      },
      {
        title: 'Test Event 2',
        description: 'Test description 2',
        category: 'Traditional Festival',
        location: 'Test Location 2',
        coordinates: { lat: 21.2000, lng: 81.3000 },
        date: new Date('2025-07-20T15:00:00Z'),
        imageUrl: 'https://example.com/image2.jpg'
      }
    ]);
  });

  describe('GET /events', () => {
    it('should return all events with pagination', async () => {
      const response = await request(app)
        .get('/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.totalItems).toBe(2);
    });

    it('should filter events by search query', async () => {
      const response = await request(app)
        .get('/events?query=Test Event 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].title).toBe('Test Event 1');
    });

    it('should filter events by category', async () => {
      const response = await request(app)
        .get('/events?category=Cultural Event')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].category).toBe('Cultural Event');
    });
  });

  describe('GET /events/:id', () => {
    it('should return event by ID', async () => {
      const event = await Event.findOne();
      
      const response = await request(app)
        .get(`/events/${event!._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe(event!.title);
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/events/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Event not found');
    });
  });
});
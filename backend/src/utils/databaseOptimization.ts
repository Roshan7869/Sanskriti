import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { HistoricalPlace } from '../models/HistoricalPlace.js';
import { Influencer } from '../models/Influencer.js';
import { Reporter } from '../models/Reporter.js';
import { User } from '../models/User.js';

// Database optimization utilities
export const createOptimalIndexes = async () => {
  try {
    console.log('🔧 Creating optimal database indexes...');

    // Event indexes
    await Event.collection.createIndex({ 
      title: 'text', 
      description: 'text', 
      location: 'text' 
    }, { 
      name: 'event_text_search',
      weights: { title: 10, description: 5, location: 3 }
    });
    
    await Event.collection.createIndex({ date: 1, isActive: 1 });
    await Event.collection.createIndex({ category: 1, isActive: 1 });
    await Event.collection.createIndex({ location: 1, date: 1 });
    await Event.collection.createIndex({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

    // Historical Places indexes
    await HistoricalPlace.collection.createIndex({ 
      title: 'text', 
      description: 'text' 
    }, { 
      name: 'place_text_search',
      weights: { title: 10, description: 5 }
    });
    
    await HistoricalPlace.collection.createIndex({ rating: -1, isActive: 1 });
    await HistoricalPlace.collection.createIndex({ category: 1, isActive: 1 });
    await HistoricalPlace.collection.createIndex({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

    // Influencer indexes
    await Influencer.collection.createIndex({ 
      name: 'text', 
      username: 'text', 
      bio: 'text' 
    }, { 
      name: 'influencer_text_search',
      weights: { name: 10, username: 8, bio: 3 }
    });
    
    await Influencer.collection.createIndex({ category: 1, isActive: 1 });
    await Influencer.collection.createIndex({ username: 1 }, { unique: true });

    // Reporter indexes
    await Reporter.collection.createIndex({ 
      name: 'text', 
      username: 'text', 
      outlet: 'text' 
    }, { 
      name: 'reporter_text_search',
      weights: { name: 10, username: 8, outlet: 5 }
    });
    
    await Reporter.collection.createIndex({ outlet: 1, isActive: 1 });
    await Reporter.collection.createIndex({ username: 1 }, { unique: true });

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ membershipLevel: 1, approved: 1 });
    await User.collection.createIndex({ 'favorites.events': 1 });
    await User.collection.createIndex({ 'favorites.places': 1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

// Query optimization helpers
export const optimizedQueries = {
  // Optimized event search with aggregation
  searchEvents: async (filters: any, page: number, limit: number) => {
    const pipeline: any[] = [];
    
    // Match stage
    const matchStage: any = { isActive: true };
    
    if (filters.query) {
      matchStage.$text = { $search: filters.query };
    }
    
    if (filters.category) {
      matchStage.category = new RegExp(filters.category, 'i');
    }
    
    if (filters.location) {
      matchStage.location = new RegExp(filters.location, 'i');
    }
    
    if (filters.date) {
      const searchDate = new Date(filters.date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      matchStage.date = { $gte: searchDate, $lt: nextDay };
    }
    
    pipeline.push({ $match: matchStage });
    
    // Add text score for sorting if text search is used
    if (filters.query) {
      pipeline.push({ $addFields: { score: { $meta: 'textScore' } } });
      pipeline.push({ $sort: { score: { $meta: 'textScore' }, date: 1 } });
    } else {
      pipeline.push({ $sort: { date: 1 } });
    }
    
    // Facet for pagination and count
    pipeline.push({
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ],
        count: [
          { $count: 'total' }
        ]
      }
    });
    
    const result = await Event.aggregate(pipeline);
    const events = result[0].data;
    const total = result[0].count[0]?.total || 0;
    
    return { events, total };
  },

  // Optimized places search
  searchPlaces: async (filters: any, page: number, limit: number) => {
    const pipeline: any[] = [];
    
    const matchStage: any = { isActive: true };
    
    if (filters.query) {
      matchStage.$text = { $search: filters.query };
    }
    
    pipeline.push({ $match: matchStage });
    
    if (filters.query) {
      pipeline.push({ $addFields: { score: { $meta: 'textScore' } } });
      pipeline.push({ $sort: { score: { $meta: 'textScore' }, rating: -1 } });
    } else {
      pipeline.push({ $sort: { rating: -1, createdAt: -1 } });
    }
    
    pipeline.push({
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ],
        count: [
          { $count: 'total' }
        ]
      }
    });
    
    const result = await HistoricalPlace.aggregate(pipeline);
    const places = result[0].data;
    const total = result[0].count[0]?.total || 0;
    
    return { places, total };
  },

  // Get popular events (cached)
  getPopularEvents: async (limit: number = 5) => {
    return await Event.find({ isActive: true })
      .sort({ date: 1 })
      .limit(limit)
      .lean()
      .hint({ date: 1, isActive: 1 }); // Use specific index
  },

  // Get top-rated places (cached)
  getTopRatedPlaces: async (limit: number = 5) => {
    return await HistoricalPlace.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(limit)
      .lean()
      .hint({ rating: -1, isActive: 1 }); // Use specific index
  }
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    return {
      status: 'healthy',
      stats: {
        collections: collections.length,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        objects: stats.objects
      },
      indexes: await Promise.all(
        collections.map(async (col) => {
          const indexes = await mongoose.connection.db.collection(col.name).indexes();
          return { collection: col.name, indexes: indexes.length };
        })
      )
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
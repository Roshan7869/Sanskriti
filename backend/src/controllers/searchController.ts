import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { HistoricalPlace } from '../models/HistoricalPlace.js';
import { Influencer } from '../models/Influencer.js';
import { Reporter } from '../models/Reporter.js';
import { ApiResponse, SearchQuery, PaginationQuery } from '../types/index.js';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query,
      type = 'all',
      page = '1',
      limit = '10'
    }: SearchQuery & PaginationQuery = req.query;

    if (!query) {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      } as ApiResponse);
      return;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = {
      $text: { $search: query },
      isActive: true
    };

    let results: any = {};

    if (type === 'events' || type === 'all') {
      const [events, eventsTotal] = await Promise.all([
        Event.find(searchFilter)
          .sort({ score: { $meta: 'textScore' }, date: 1 })
          .skip(type === 'events' ? skip : 0)
          .limit(type === 'events' ? limitNum : 5)
          .lean(),
        Event.countDocuments(searchFilter)
      ]);

      results.events = {
        items: events,
        total: eventsTotal
      };
    }

    if (type === 'places' || type === 'all') {
      const [places, placesTotal] = await Promise.all([
        HistoricalPlace.find(searchFilter)
          .sort({ score: { $meta: 'textScore' }, rating: -1 })
          .skip(type === 'places' ? skip : 0)
          .limit(type === 'places' ? limitNum : 5)
          .lean(),
        HistoricalPlace.countDocuments(searchFilter)
      ]);

      results.places = {
        items: places,
        total: placesTotal
      };
    }

    if (type === 'all') {
      // Also search influencers and reporters for comprehensive results
      const [influencers, reporters] = await Promise.all([
        Influencer.find(searchFilter)
          .sort({ score: { $meta: 'textScore' } })
          .limit(3)
          .lean(),
        Reporter.find(searchFilter)
          .sort({ score: { $meta: 'textScore' } })
          .limit(3)
          .lean()
      ]);

      results.influencers = { items: influencers };
      results.reporters = { items: reporters };
    }

    // Calculate pagination for specific type searches
    let pagination = undefined;
    if (type !== 'all') {
      const total = results[type]?.total || 0;
      const totalPages = Math.ceil(total / limitNum);
      
      pagination = {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      };
    }

    res.json({
      success: true,
      data: {
        results,
        pagination,
        searchQuery: query,
        searchType: type
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    } as ApiResponse);
  }
};
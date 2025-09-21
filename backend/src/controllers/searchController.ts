import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { Location } from '../models/Location.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../types/index.js';

interface SearchQuery {
    query?: string;
    type?: 'all' | 'locations' | 'events' | 'members';
    page?: string;
    limit?: string;
}

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query,
      type = 'all',
      page = '1',
      limit = '10'
    }: SearchQuery = req.query;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const searchFilter = { $text: { $search: query } };
    let results: any = {};

    if (type === 'locations' || type === 'all') {
      const [items, total] = await Promise.all([
        Location.find(searchFilter).sort({ score: { $meta: 'textScore' } }).skip(type === 'locations' ? skip : 0).limit(type === 'locations' ? limitNum : 5).lean(),
        Location.countDocuments(searchFilter)
      ]);
      results.locations = { items, total };
    }

    if (type === 'events' || type === 'all') {
      const [items, total] = await Promise.all([
        Event.find(searchFilter).sort({ score: { $meta: 'textScore' } }).skip(type === 'events' ? skip : 0).limit(type === 'events' ? limitNum : 5).lean(),
        Event.countDocuments(searchFilter)
      ]);
      results.events = { items, total };
    }

    if (type === 'members' || type === 'all') {
        const memberFilter = { ...searchFilter, membershipStatus: 'plus_approved' };
        const [items, total] = await Promise.all([
            User.find(memberFilter).select('username profileImage bio socialLinks').sort({ score: { $meta: 'textScore' } }).skip(type === 'members' ? skip : 0).limit(type === 'members' ? limitNum : 3).lean(),
            User.countDocuments(memberFilter)
        ]);
        results.members = { items, total };
    }

    res.json({
      success: true,
      data: { results, searchQuery: query, searchType: type }
    } as ApiResponse);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};

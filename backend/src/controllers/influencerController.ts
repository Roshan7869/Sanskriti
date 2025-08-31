import { Request, Response } from 'express';
import { Influencer } from '../models/Influencer.js';
import { ApiResponse, PaginationQuery } from '../types/index.js';

export const getInfluencers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      query
    }: PaginationQuery & { query?: string } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { isActive: true };

    // Text search
    if (query) {
      filter.$text = { $search: query };
    }

    // Execute query with pagination
    const [influencers, total] = await Promise.all([
      Influencer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Influencer.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        influencers,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get influencers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencers'
    } as ApiResponse);
  }
};

export const getInfluencerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const influencer = await Influencer.findOne({ _id: id, isActive: true });
    if (!influencer) {
      res.status(404).json({
        success: false,
        error: 'Influencer not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { influencer }
    } as ApiResponse);
  } catch (error) {
    console.error('Get influencer by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencer'
    } as ApiResponse);
  }
};

export const createInfluencer = async (req: Request, res: Response): Promise<void> => {
  try {
    const influencerData = req.body;

    const influencer = new Influencer(influencerData);
    await influencer.save();

    res.status(201).json({
      success: true,
      data: { influencer },
      message: 'Influencer created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Create influencer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create influencer'
    } as ApiResponse);
  }
};
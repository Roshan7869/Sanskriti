import { Request, Response } from 'express';
import { Reporter } from '../models/Reporter.js';
import { ApiResponse, PaginationQuery } from '../types/index.js';

export const getReporters = async (req: Request, res: Response): Promise<void> => {
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
    const [reporters, total] = await Promise.all([
      Reporter.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Reporter.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        reporters,
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
    console.error('Get reporters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reporters'
    } as ApiResponse);
  }
};

export const getReporterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const reporter = await Reporter.findOne({ _id: id, isActive: true });
    if (!reporter) {
      res.status(404).json({
        success: false,
        error: 'Reporter not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { reporter }
    } as ApiResponse);
  } catch (error) {
    console.error('Get reporter by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reporter'
    } as ApiResponse);
  }
};

export const createReporter = async (req: Request, res: Response): Promise<void> => {
  try {
    const reporterData = req.body;

    const reporter = new Reporter(reporterData);
    await reporter.save();

    res.status(201).json({
      success: true,
      data: { reporter },
      message: 'Reporter created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Create reporter error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reporter'
    } as ApiResponse);
  }
};
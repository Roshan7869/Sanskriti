import { Request, Response } from 'express';
import { HistoricalPlace } from '../models/HistoricalPlace.js';
import { ApiResponse, PaginationQuery } from '../types/index.js';

export const getPlaces = async (req: Request, res: Response): Promise<void> => {
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
    const [places, total] = await Promise.all([
      HistoricalPlace.find(filter)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      HistoricalPlace.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        places,
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
    console.error('Get places error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch places'
    } as ApiResponse);
  }
};

export const getPlaceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const place = await HistoricalPlace.findOne({ _id: id, isActive: true });
    if (!place) {
      res.status(404).json({
        success: false,
        error: 'Place not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { place }
    } as ApiResponse);
  } catch (error) {
    console.error('Get place by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch place'
    } as ApiResponse);
  }
};

export const createPlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const placeData = req.body;

    const place = new HistoricalPlace(placeData);
    await place.save();

    res.status(201).json({
      success: true,
      data: { place },
      message: 'Place created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create place'
    } as ApiResponse);
  }
};

export const updatePlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const place = await HistoricalPlace.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!place) {
      res.status(404).json({
        success: false,
        error: 'Place not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { place },
      message: 'Place updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update place'
    } as ApiResponse);
  }
};

export const deletePlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const place = await HistoricalPlace.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!place) {
      res.status(404).json({
        success: false,
        error: 'Place not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Place deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete place'
    } as ApiResponse);
  }
};
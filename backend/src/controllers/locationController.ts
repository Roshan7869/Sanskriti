import { Request, Response } from 'express';
import { Location } from '../models/Location.js';
import { ApiResponse, PaginationQuery } from '../types/index.js';

export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      query,
      category,
      lat,
      lng,
      radius = '10' // Default radius of 10km
    }: PaginationQuery & { query?: string, category?: string, lat?: string, lng?: string, radius?: string } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    // Text search
    if (query) {
      filter.$text = { $search: query };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Geospatial search
    if (lat && lng) {
      filter.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      };
    }

    // Execute query with pagination
    const [locations, total] = await Promise.all([
      Location.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Location.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        locations,
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
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations'
    } as ApiResponse);
  }
};

export const getLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      res.status(404).json({
        success: false,
        error: 'Location not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { location }
    } as ApiResponse);
  } catch (error) {
    console.error('Get location by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch location'
    } as ApiResponse);
  }
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const locationData = req.body;

    const location = new Location(locationData);
    await location.save();

    res.status(201).json({
      success: true,
      data: { location },
      message: 'Location created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create location'
    } as ApiResponse);
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const location = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!location) {
      res.status(404).json({
        success: false,
        error: 'Location not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { location },
      message: 'Location updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update location'
    } as ApiResponse);
  }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      res.status(404).json({
        success: false,
        error: 'Location not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Location deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete location'
    } as ApiResponse);
  }
};

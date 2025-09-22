import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { cacheUtils, invalidateCache } from '../middleware/cache.js';
import { optimizedQueries } from '../utils/databaseOptimization.js';
import { ApiResponse, EventQuery, AuthenticatedRequest } from '../types/index.js';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      query,
      date,
      category,
      location
    }: EventQuery = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    
    // Use optimized query
    const { events, total } = await optimizedQueries.searchEvents(
      { query, date, category, location },
      pageNum,
      limitNum
    );

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        events,
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
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    } as ApiResponse);
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, isActive: true });
    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { event }
    } as ApiResponse);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    } as ApiResponse);
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const eventData = req.body;

    const event = new Event(eventData);
    await event.save();

    // Invalidate related caches
    await invalidateCache(['events:*', 'search:*']);

    res.status(201).json({
      success: true,
      data: { event },
      message: 'Event created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    } as ApiResponse);
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      } as ApiResponse);
      return;
    }

    // Invalidate related caches
    await invalidateCache(['events:*', 'search:*']);

    res.json({
      success: true,
      data: { event },
      message: 'Event updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    } as ApiResponse);
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      } as ApiResponse);
      return;
    }

    // Invalidate related caches
    await invalidateCache(['events:*', 'search:*']);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    } as ApiResponse);
  }
};
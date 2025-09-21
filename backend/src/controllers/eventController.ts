import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { ApiResponse, AuthenticatedRequest } from '../types/index.js';

interface EventQuery {
    page?: string;
    limit?: string;
    query?: string;
    date?: string;
    type?: string;
    location?: string;
}

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      query,
      date,
      type
    }: EventQuery = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (query) {
      filter.$text = { $search: query };
    }

    if (date) {
      const searchDate = new Date(date);
      filter.startDate = { $gte: searchDate };
    } else {
      // By default, only show upcoming events
      filter.startDate = { $gte: new Date() };
    }

    if (type) {
      filter.type = type;
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate('location', 'name address')
        .lean(),
      Event.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        events,
        pagination: { currentPage: pageNum, totalPages, totalItems: total }
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('location', 'name address');
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }
    res.json({ success: true, data: { event } });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, data: { event }, message: 'Event created' });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }
    res.json({ success: true, data: { event }, message: 'Event updated' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
};

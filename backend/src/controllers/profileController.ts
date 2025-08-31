import { Response } from 'express';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { HistoricalPlace } from '../models/HistoricalPlace.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId)
      .populate('favorites.events', 'title category date location imageUrl')
      .populate('favorites.places', 'title category rating imageUrl');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          region: user.region,
          favorites: user.favorites,
          createdAt: user.createdAt
        }
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    } as ApiResponse);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { region } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { region },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          region: user.region,
          favorites: user.favorites
        }
      },
      message: 'Profile updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    } as ApiResponse);
  }
};

export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, itemId } = req.body;

    if (!['events', 'places'].includes(type)) {
      res.status(400).json({
        success: false,
        error: 'Invalid favorite type. Must be "events" or "places"'
      } as ApiResponse);
      return;
    }

    // Verify the item exists
    if (type === 'events') {
      const event = await Event.findById(itemId);
      if (!event) {
        res.status(404).json({
          success: false,
          error: 'Event not found'
        } as ApiResponse);
        return;
      }
    } else {
      const place = await HistoricalPlace.findById(itemId);
      if (!place) {
        res.status(404).json({
          success: false,
          error: 'Place not found'
        } as ApiResponse);
        return;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { [`favorites.${type}`]: itemId } },
      { new: true }
    ).populate(`favorites.${type}`);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { favorites: user.favorites },
      message: 'Added to favorites successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to favorites'
    } as ApiResponse);
  }
};

export const removeFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, itemId } = req.body;

    if (!['events', 'places'].includes(type)) {
      res.status(400).json({
        success: false,
        error: 'Invalid favorite type. Must be "events" or "places"'
      } as ApiResponse);
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { [`favorites.${type}`]: itemId } },
      { new: true }
    ).populate(`favorites.${type}`);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { favorites: user.favorites },
      message: 'Removed from favorites successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from favorites'
    } as ApiResponse);
  }
};
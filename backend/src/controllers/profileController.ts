import { Response } from 'express';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Location } from '../models/Location.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

const shapeUserProfile = (user: any) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    bio: user.bio,
    socialLinks: user.socialLinks,
    membershipStatus: user.membershipStatus,
    favorites: user.favorites,
    createdAt: user.createdAt,
});

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId)
      .populate('favorites.events', 'name type startDate')
      .populate('favorites.locations', 'name category images');

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: { user: shapeUserProfile(user) } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { bio, profileImage, socialLinks } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { bio, profileImage, socialLinks },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: { user: shapeUserProfile(user) }, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, itemId } = req.body;

    if (!['events', 'locations'].includes(type)) {
      res.status(400).json({ success: false, error: 'Invalid favorite type' });
      return;
    }

    if (type === 'events') {
      if (!await Event.findById(itemId)) return res.status(404).json({ success: false, error: 'Event not found' });
    } else {
      if (!await Location.findById(itemId)) return res.status(404).json({ success: false, error: 'Location not found' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { [`favorites.${type}`]: itemId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: { favorites: user.favorites }, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add to favorites' });
  }
};

export const removeFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, itemId } = req.body;

    if (!['events', 'locations'].includes(type)) {
      res.status(400).json({ success: false, error: 'Invalid favorite type' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { [`favorites.${type}`]: itemId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: { favorites: user.favorites }, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove from favorites' });
  }
};

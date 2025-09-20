import { Response } from 'express';
import { InstagramReel } from '../models/InstagramReel.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const getReels = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      locationId,
      eventId,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { isActive: true, isApproved: true };

    if (locationId) {
      filter.locationId = locationId;
    }

    if (eventId) {
      filter.eventId = eventId;
    }

    // Execute query with pagination
    const [reels, total] = await Promise.all([
      InstagramReel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      InstagramReel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        reels,
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
    console.error('Get reels error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reels'
    } as ApiResponse);
  }
};

export const createReel = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { locationId, eventId, reelUrl, caption, instagramId } = req.body;

    // Check if user has plus membership and is approved
    const user = await User.findById(userId);
    if (!user || user.membershipLevel !== 'plus' || !user.approved) {
      res.status(403).json({
        success: false,
        error: 'Plus membership required to upload reels'
      } as ApiResponse);
      return;
    }

    // Extract Instagram ID from URL if not provided
    let finalInstagramId = instagramId;
    if (!finalInstagramId) {
      const match = reelUrl.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      finalInstagramId = match ? match[2] : undefined;
    }

    const reel = new InstagramReel({
      locationId: locationId || undefined,
      eventId: eventId || undefined,
      uploaderId: userId,
      uploaderName: user.email.split('@')[0], // Use email prefix as name for now
      uploaderType: 'creator',
      reelUrl,
      instagramId: finalInstagramId,
      caption,
      isApproved: false // Requires admin approval
    });

    await reel.save();

    res.status(201).json({
      success: true,
      data: { reel },
      message: 'Reel uploaded successfully and is pending approval'
    } as ApiResponse);
  } catch (error) {
    console.error('Create reel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload reel'
    } as ApiResponse);
  }
};

export const approveReel = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user is admin (you might want to add an isAdmin field to User model)
    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    const reel = await InstagramReel.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!reel) {
      res.status(404).json({
        success: false,
        error: 'Reel not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { reel },
      message: 'Reel approved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Approve reel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve reel'
    } as ApiResponse);
  }
};

export const deleteReel = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const reel = await InstagramReel.findById(id);
    if (!reel) {
      res.status(404).json({
        success: false,
        error: 'Reel not found'
      } as ApiResponse);
      return;
    }

    // Check if user owns the reel or is admin
    if (reel.uploaderId.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this reel'
      } as ApiResponse);
      return;
    }

    await InstagramReel.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Reel deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Delete reel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete reel'
    } as ApiResponse);
  }
};
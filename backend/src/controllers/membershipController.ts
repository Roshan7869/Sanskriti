import { Response } from 'express';
import { MembershipApplication } from '../models/MembershipApplication.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const applyForPlus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { instagramHandle, bio, sampleWork } = req.body;

    // Check if user already has an application
    const existingApplication = await MembershipApplication.findOne({ userId });
    if (existingApplication) {
      res.status(400).json({
        success: false,
        error: 'You have already submitted a membership application'
      } as ApiResponse);
      return;
    }

    // Check if user already has plus membership
    const user = await User.findById(userId);
    if (user?.membershipLevel === 'plus') {
      res.status(400).json({
        success: false,
        error: 'You already have Plus membership'
      } as ApiResponse);
      return;
    }

    const application = new MembershipApplication({
      userId,
      instagramHandle,
      bio,
      sampleWork
    });

    await application.save();

    res.status(201).json({
      success: true,
      data: { application },
      message: 'Plus membership application submitted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Apply for plus error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application'
    } as ApiResponse);
  }
};

export const getApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const application = await MembershipApplication.findOne({ userId });
    
    res.json({
      success: true,
      data: { application }
    } as ApiResponse);
  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch application status'
    } as ApiResponse);
  }
};

export const getApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    // Execute query with pagination
    const [applications, total] = await Promise.all([
      MembershipApplication.find(filter)
        .populate('userId', 'email region')
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      MembershipApplication.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        applications,
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
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    } as ApiResponse);
  }
};

export const reviewApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.params; // 'approve' or 'reject'
    const { reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!['approve', 'reject'].includes(action)) {
      res.status(400).json({
        success: false,
        error: 'Invalid action. Must be "approve" or "reject"'
      } as ApiResponse);
      return;
    }

    const application = await MembershipApplication.findById(id);
    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found'
      } as ApiResponse);
      return;
    }

    if (application.status !== 'pending') {
      res.status(400).json({
        success: false,
        error: 'Application has already been reviewed'
      } as ApiResponse);
      return;
    }

    // Update application status
    application.status = action === 'approve' ? 'approved' : 'rejected';
    application.reviewedAt = new Date();
    application.reviewedBy = reviewerId as any;
    application.reviewNotes = reviewNotes;

    await application.save();

    // If approved, update user's membership level
    if (action === 'approve') {
      await User.findByIdAndUpdate(application.userId, {
        membershipLevel: 'plus',
        approved: true
      });
    }

    res.json({
      success: true,
      data: { application },
      message: `Application ${action}d successfully`
    } as ApiResponse);
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to review application'
    } as ApiResponse);
  }
};
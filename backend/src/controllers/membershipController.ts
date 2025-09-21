import { Response } from 'express';
import { MembershipApplication } from '../models/MembershipApplication.js';
import { User } from '../models/User.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const applyForMembership = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const { instagramHandle, bio, sampleWork } = req.body;

    // Check if user already has a non-rejected application or is already a plus member
    const user = await User.findById(userId);
    if (user?.membershipStatus === 'plus_approved' || user?.membershipStatus === 'plus_pending') {
      res.status(400).json({
        success: false,
        error: `Your membership status is already "${user.membershipStatus}"`
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

    // Update user's status to pending
    user.membershipStatus = 'plus_pending';
    await user.save();

    res.status(201).json({
      success: true,
      data: { application },
      message: 'Plus membership application submitted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Apply for membership error:', error);
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
    const { status, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (status) filter.status = status;

    const [applications, total] = await Promise.all([
      MembershipApplication.find(filter)
        .populate('userId', 'username email') // Updated fields
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
        pagination: { currentPage: pageNum, totalPages, totalItems: total }
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
    const { status, reviewNotes } = req.body; // 'approved' or 'rejected'
    const reviewerId = req.user?.id;

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "approved" or "rejected"'
      } as ApiResponse);
      return;
    }

    const application = await MembershipApplication.findById(id);
    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found' });
      return;
    }

    if (application.status !== 'pending') {
      res.status(400).json({ success: false, error: 'Application has already been reviewed' });
      return;
    }

    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = reviewerId as any;
    application.reviewNotes = reviewNotes;
    await application.save();

    // Update user's membership status
    const newMembershipStatus = status === 'approved' ? 'plus_approved' : 'regular';
    await User.findByIdAndUpdate(application.userId, {
      membershipStatus: newMembershipStatus
    });

    res.json({
      success: true,
      data: { application },
      message: `Application ${status} successfully`
    } as ApiResponse);
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to review application'
    } as ApiResponse);
  }
};

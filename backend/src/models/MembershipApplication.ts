import mongoose, { Document, Schema } from 'mongoose';

export interface IMembershipApplication extends Document {
  userId: mongoose.Types.ObjectId;
  instagramHandle?: string;
  bio: string;
  sampleWork?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const membershipApplicationSchema = new Schema<IMembershipApplication>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  instagramHandle: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_.]+$/, 'Instagram handle can only contain letters, numbers, dots, and underscores']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  sampleWork: {
    type: String,
    trim: true,
    validate: {
      validator: function(url: string) {
        if (!url) return true; // Optional field
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Sample work must be a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
membershipApplicationSchema.index({ userId: 1 });
membershipApplicationSchema.index({ status: 1 });
membershipApplicationSchema.index({ appliedAt: -1 });

export const MembershipApplication = mongoose.model<IMembershipApplication>('MembershipApplication', membershipApplicationSchema);
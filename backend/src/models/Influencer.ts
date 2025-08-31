import mongoose, { Document, Schema } from 'mongoose';

export interface IInfluencer extends Document {
  username: string;
  name: string;
  category: string;
  imageUrl: string;
  followers: string;
  bio?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const influencerSchema = new Schema<IInfluencer>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food & Culture',
      'Heritage',
      'Travel',
      'Lifestyle',
      'Traditions',
      'Art',
      'Music',
      'Dance',
      'Photography'
    ],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Profile image URL is required'],
    trim: true
  },
  followers: {
    type: String,
    required: [true, 'Followers count is required'],
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  socialLinks: {
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
influencerSchema.index({ username: 1 });
influencerSchema.index({ category: 1 });
influencerSchema.index({ name: 'text', bio: 'text' });
influencerSchema.index({ isActive: 1 });

export const Influencer = mongoose.model<IInfluencer>('Influencer', influencerSchema);
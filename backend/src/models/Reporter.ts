import mongoose, { Document, Schema } from 'mongoose';

export interface IReporter extends Document {
  username: string;
  name: string;
  outlet: string;
  imageUrl: string;
  followers: string;
  bio?: string;
  articles: Array<{
    title: string;
    link: string;
    publishedAt: Date;
  }>;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reporterSchema = new Schema<IReporter>({
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
  outlet: {
    type: String,
    required: [true, 'News outlet is required'],
    trim: true,
    maxlength: [100, 'Outlet name cannot exceed 100 characters']
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
  articles: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Article title cannot exceed 200 characters']
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  }],
  socialLinks: {
    instagram: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
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
reporterSchema.index({ username: 1 });
reporterSchema.index({ outlet: 1 });
reporterSchema.index({ name: 'text', bio: 'text' });
reporterSchema.index({ isActive: 1 });

export const Reporter = mongoose.model<IReporter>('Reporter', reporterSchema);
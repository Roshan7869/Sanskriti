import mongoose, { Document, Schema } from 'mongoose';

export interface IInstagramReel extends Document {
  locationId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  uploaderName: string;
  uploaderType: 'admin' | 'creator';
  reelUrl: string;
  instagramId?: string;
  caption: string;
  thumbnailUrl?: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const instagramReelSchema = new Schema<IInstagramReel>({
  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'HistoricalPlace',
    required: false
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: false
  },
  uploaderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  uploaderName: {
    type: String,
    required: [true, 'Uploader name is required'],
    trim: true
  },
  uploaderType: {
    type: String,
    required: [true, 'Uploader type is required'],
    enum: ['admin', 'creator'],
    default: 'creator'
  },
  reelUrl: {
    type: String,
    required: [true, 'Instagram reel URL is required'],
    trim: true,
    validate: {
      validator: function(url: string) {
        return /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/.test(url);
      },
      message: 'Please provide a valid Instagram post or reel URL'
    }
  },
  instagramId: {
    type: String,
    trim: true,
    sparse: true
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    trim: true,
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
instagramReelSchema.index({ locationId: 1 });
instagramReelSchema.index({ eventId: 1 });
instagramReelSchema.index({ uploaderId: 1 });
instagramReelSchema.index({ isApproved: 1, isActive: 1 });
instagramReelSchema.index({ createdAt: -1 });

// Ensure either locationId or eventId is provided
instagramReelSchema.pre('validate', function(next) {
  if (!this.locationId && !this.eventId) {
    next(new Error('Either locationId or eventId must be provided'));
  } else {
    next();
  }
});

export const InstagramReel = mongoose.model<IInstagramReel>('InstagramReel', instagramReelSchema);
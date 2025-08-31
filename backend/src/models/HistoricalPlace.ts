import mongoose, { Document, Schema } from 'mongoose';

export interface IHistoricalPlace extends Document {
  title: string;
  description: string;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const historicalPlaceSchema = new Schema<IHistoricalPlace>({
  title: {
    type: String,
    required: [true, 'Place title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Place description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Place category is required'],
    enum: [
      'Park & Zoo',
      'Industrial Heritage',
      'Religious Site',
      'Cultural Center',
      'Sports Complex',
      'Museum',
      'Monument',
      'Archaeological Site'
    ],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Place image URL is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
historicalPlaceSchema.index({ title: 'text', description: 'text' });
historicalPlaceSchema.index({ category: 1 });
historicalPlaceSchema.index({ rating: -1 });
historicalPlaceSchema.index({ isActive: 1 });

export const HistoricalPlace = mongoose.model<IHistoricalPlace>('HistoricalPlace', historicalPlaceSchema);
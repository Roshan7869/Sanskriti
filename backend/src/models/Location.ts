import mongoose, { Document, Schema } from 'mongoose';

// Interface matching the architectural plan
export interface ILocation extends Document {
  name: string;
  description: string;
  images: string[];
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address?: string;
  category: 'historical' | 'natural' | 'urban' | 'adventure';
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Location description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  images: [{
    type: String,
    trim: true,
    required: [true, 'At least one image URL is required']
  }],
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2 && coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Coordinates must be an array of [longitude, latitude]'
      }
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Location category is required'],
    enum: ['historical', 'natural', 'urban', 'adventure'],
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
locationSchema.index({ name: 'text', description: 'text' }); // For text search
locationSchema.index({ coordinates: '2dsphere' }); // For geospatial queries
locationSchema.index({ category: 1 });

export const Location = mongoose.model<ILocation>('Location', locationSchema);

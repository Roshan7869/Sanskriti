import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: mongoose.Types.ObjectId; // Optional ref to a Location
  coordinates?: { // Only if not tied to a Location
    type: 'Point';
    coordinates: [number, number];
  };
  type: 'festival' | 'celebration' | 'pandal' | 'event';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(date: Date) {
        // Allow dates in the past for historical events, but default validation can be here
        return true;
      },
      message: 'Start date must be valid'
    }
  },
  endDate: {
    type: Date,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['festival', 'celebration', 'pandal', 'event']
  },
  images: [{
    type: String,
    trim: true,
    required: [true, 'At least one image URL is required']
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ name: 'text', description: 'text' });
eventSchema.index({ startDate: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ coordinates: '2dsphere' });

export const Event = mongoose.model<IEvent>('Event', eventSchema);

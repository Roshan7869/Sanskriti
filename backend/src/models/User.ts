import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  region: string;
  membershipLevel: 'basic' | 'plus';
  approved: boolean;
  favorites: {
    events: mongoose.Types.ObjectId[];
    places: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  region: {
    type: String,
    default: 'Bhilai, CG',
    trim: true
  },
  membershipLevel: {
    type: String,
    enum: ['basic', 'plus'],
    default: 'basic'
  },
  approved: {
    type: Boolean,
    default: false
  },
  favorites: {
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    places: [{
      type: Schema.Types.ObjectId,
      ref: 'HistoricalPlace'
    }]
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
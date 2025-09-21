import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { ApiResponse, UserRegistration, UserLogin } from '../types/index.js';

// Helper to shape user data for responses
const shapeUserData = (user: any) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage,
  bio: user.bio,
  socialLinks: user.socialLinks,
  membershipStatus: user.membershipStatus,
  role: user.role,
  favorites: user.favorites,
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: UserRegistration = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email or username'
      } as ApiResponse);
      return;
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: shapeUserData(user)
      },
      message: 'User registered successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserLogin = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.json({
      success: true,
      data: {
        token,
        user: shapeUserData(user)
      },
      message: 'Login successful'
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    } as ApiResponse);
  }
};

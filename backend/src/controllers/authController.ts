import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { ApiResponse, UserRegistration, UserLogin } from '../types/index.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, region }: UserRegistration = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      } as ApiResponse);
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      region: region || 'Bhilai, CG'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          region: user.region,
          favorites: user.favorites
        }
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
    const token = generateToken(user._id.toString(), user.email);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          region: user.region,
          favorites: user.favorites
        }
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

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      } as ApiResponse);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          region: user.region,
          favorites: user.favorites
        }
      }
    } as ApiResponse);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    } as ApiResponse);
  }
};
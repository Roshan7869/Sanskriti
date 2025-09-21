import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SearchQuery {
  query?: string;
  type?: 'events' | 'places' | 'all';
}

export interface EventQuery extends PaginationQuery, SearchQuery {
  date?: string;
  category?: string;
  location?: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: {
    instagram?: string;
    newsChannel?: string;
  };
  membershipStatus: 'regular' | 'plus_pending' | 'plus_approved';
  favorites: {
    events: string[];
    locations: string[];
  };
}
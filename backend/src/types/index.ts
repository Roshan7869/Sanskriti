import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
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
  email: string;
  password: string;
  region?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  email: string;
  region: string;
  favorites: {
    events: string[];
    places: string[];
  };
}
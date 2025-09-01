export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistoricalPlace {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Influencer {
  _id: string;
  username: string;
  name: string;
  category: string;
  imageUrl: string;
  followers: string;
  bio?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reporter {
  _id: string;
  username: string;
  name: string;
  outlet: string;
  imageUrl: string;
  followers: string;
  bio?: string;
  articles: Array<{
    title: string;
    link: string;
    publishedAt: string;
  }>;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  region: string;
  favorites: {
    events: string[];
    places: string[];
  };
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export interface Location {
  _id: string;
  name: string;
  description: string;
  images: string[];
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address?: string;
  category: 'historical' | 'natural' | 'urban' | 'adventure';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string; // Reference to Location ID
  coordinates?: {
    type: 'Point';
    coordinates: [number, number];
  };
  type: 'festival' | 'celebration' | 'pandal' | 'event';
  images: string[];
  createdAt: string;
  updatedAt:string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    newsChannel?: string;
  };
  membershipStatus: 'regular' | 'plus_pending' | 'plus_approved';
  role: 'user' | 'admin';
  favorites: {
    events: string[];
    locations: string[];
  };
  createdAt: string;
}

// A simplified type for displaying featured members
export interface Member {
  _id: string;
  username: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    newsChannel?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Content {
  _id: string;
  title?: string;
  url: string;
  type: 'reel' | 'vlog' | 'news';
  creator: string; // User ID
  linkedTo: {
    type: 'location' | 'event';
    id: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationDetail extends Location {
  contents: Content[];
}

export interface MembershipApplication {
  _id:string;
  userId: string;
  instagramHandle?: string;
  bio: string;
  sampleWork?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string; // User ID
}

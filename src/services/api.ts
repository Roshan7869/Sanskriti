import axios from 'axios';
import { ApiResponse, Event, HistoricalPlace, Influencer, Reporter, AuthResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, region?: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      region
    });
    return response.data.data!;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password
    });
    return response.data.data!;
  },

  verifyToken: async (): Promise<{ user: any }> => {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/verify');
    return response.data.data!;
  }
};

// Events API
export const eventsAPI = {
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
    category?: string;
    date?: string;
    location?: string;
  }): Promise<{ events: Event[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ events: Event[]; pagination: any }>>('/events', {
      params
    });
    return response.data.data!;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get<ApiResponse<{ event: Event }>>(`/events/${id}`);
    return response.data.data!.event;
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const response = await api.post<ApiResponse<{ event: Event }>>('/events', eventData);
    return response.data.data!.event;
  }
};

// Places API
export const placesAPI = {
  getPlaces: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
  }): Promise<{ places: HistoricalPlace[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ places: HistoricalPlace[]; pagination: any }>>('/places', {
      params
    });
    return response.data.data!;
  },

  getPlaceById: async (id: string): Promise<HistoricalPlace> => {
    const response = await api.get<ApiResponse<{ place: HistoricalPlace }>>(`/places/${id}`);
    return response.data.data!.place;
  }
};

// Influencers API
export const influencersAPI = {
  getInfluencers: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
  }): Promise<{ influencers: Influencer[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ influencers: Influencer[]; pagination: any }>>('/influencers', {
      params
    });
    return response.data.data!;
  },

  getInfluencerById: async (id: string): Promise<Influencer> => {
    const response = await api.get<ApiResponse<{ influencer: Influencer }>>(`/influencers/${id}`);
    return response.data.data!.influencer;
  }
};

// Reporters API
export const reportersAPI = {
  getReporters: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
  }): Promise<{ reporters: Reporter[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ reporters: Reporter[]; pagination: any }>>('/reporters', {
      params
    });
    return response.data.data!;
  },

  getReporterById: async (id: string): Promise<Reporter> => {
    const response = await api.get<ApiResponse<{ reporter: Reporter }>>(`/reporters/${id}`);
    return response.data.data!.reporter;
  }
};

// Search API
export const searchAPI = {
  search: async (params: {
    query: string;
    type?: 'events' | 'places' | 'all';
    page?: number;
    limit?: number;
  }): Promise<any> => {
    const response = await api.get<ApiResponse>('/search', { params });
    return response.data.data!;
  }
};

// Profile API
export const profileAPI = {
  getProfile: async (): Promise<{ user: any }> => {
    const response = await api.get<ApiResponse<{ user: any }>>('/profile');
    return response.data.data!;
  },

  updateProfile: async (data: { region?: string }): Promise<{ user: any }> => {
    const response = await api.put<ApiResponse<{ user: any }>>('/profile', data);
    return response.data.data!;
  },

  addToFavorites: async (type: 'events' | 'places', itemId: string): Promise<any> => {
    const response = await api.post<ApiResponse>('/profile/favorites', { type, itemId });
    return response.data.data!;
  },

  removeFromFavorites: async (type: 'events' | 'places', itemId: string): Promise<any> => {
    const response = await api.delete<ApiResponse>('/profile/favorites', {
      data: { type, itemId }
    });
    return response.data.data!;
  }
};

// Instagram Reels API
export const reelsAPI = {
  getReels: async (params?: {
    locationId?: string;
    eventId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ reels: any[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ reels: any[]; pagination: any }>>('/reels', {
      params
    });
    return response.data.data!;
  },

  createReel: async (reelData: {
    locationId?: string;
    eventId?: string;
    reelUrl: string;
    caption: string;
    instagramId?: string;
  }): Promise<any> => {
    const response = await api.post<ApiResponse<{ reel: any }>>('/reels', reelData);
    return response.data.data!.reel;
  },

  approveReel: async (reelId: string): Promise<any> => {
    const response = await api.patch<ApiResponse>(`/reels/${reelId}/approve`);
    return response.data.data!;
  },

  deleteReel: async (reelId: string): Promise<any> => {
    const response = await api.delete<ApiResponse>(`/reels/${reelId}`);
    return response.data.data!;
  }
};

// Membership API
export const membershipAPI = {
  applyForPlus: async (applicationData: {
    instagramHandle?: string;
    bio: string;
    sampleWork?: string;
  }): Promise<any> => {
    const response = await api.post<ApiResponse>('/membership/apply', applicationData);
    return response.data.data!;
  },

  getApplicationStatus: async (): Promise<any> => {
    const response = await api.get<ApiResponse>('/membership/status');
    return response.data.data!;
  },

  getApplications: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: any[]; pagination: any }> => {
    const response = await api.get<ApiResponse<{ applications: any[]; pagination: any }>>('/membership/applications', {
      params
    });
    return response.data.data!;
  },

  reviewApplication: async (applicationId: string, action: 'approve' | 'reject'): Promise<any> => {
    const response = await api.patch<ApiResponse>(`/membership/applications/${applicationId}/${action}`);
    return response.data.data!;
  }
};